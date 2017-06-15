const r = require('rethinkdb')

function generateInsertStoryRootQuery (conn) {
    return function insertStoryRoot (storyInfo, callback) {
        r.table('chapters').insert({
            title: storyInfo.title,
            content: storyInfo.content,
            time: r.now(),
            points: 0,
            path: [],
            chapters: []
        }).do((resultObj) => {
            return r.table('chapters').get(resultObj('generated_keys')(0))
        }).run(conn, callback)
    }
}

function generateGetStoryQuery (conn) {
    return function getStory (storyId, callback) {
        r.table('chapters').get(storyId)('path')
            .append(storyId)
            .map((id) => {
                return r.table('chapters').get(id)
                    .merge(chapter => {
                        let chapterQuery = 
                            chapter('chapters')
                                .map((chapter) => r.table('chapters').get(chapter))
                                .pluck('title', 'id')

                        return { chapters: chapterQuery }
                    })
            }).run(conn, callback)
    }
}

function generateInsertChapterQuery (conn) {
    return function insertChapter (storyInfo, callback) {
        r.table('chapters').insert({
            title: storyInfo.title,
            content: storyInfo.content,
            time: r.now(),
            points: 0,
            path: r.table('chapters').get(storyInfo.id)('path').append(r.table('chapters').get(storyInfo.id)('id')),
            chapters: []
        }).do((resultObj) => {
            // update parent's chapters field. return created chapter.
            return r.table('chapters').get(storyInfo.id).update((record) => {
                return { chapters: record('chapters').setInsert(resultObj('generated_keys')(0)) }
            }).do(() => {
                return r.table('chapters').get(resultObj('generated_keys')(0))
            })
        }).run(conn, callback)
    }
}

function getQueries (conn) {
    return {
        create: generateInsertStoryRootQuery(conn),
        get: generateGetStoryQuery(conn),
        addChapter: generateInsertChapterQuery(conn)
    }
}

module.exports = getQueries