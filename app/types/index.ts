export interface DialogueLine {
    role: string
    text: string
    pronunciation: string
    translation: string
    isQuestion?: boolean
}

export interface Choice {
    text: string
    pronunciation: string
    translation: string
}

export interface ConversationItem {
    id: string
    situation: string
    situation_icon: string
    dialogue: DialogueLine[]
    choices: Choice[]
    answer: string
    explanation: string
    grammar_point: string
    week: string
}

export interface RelatedTableRow {
    pronoun?: string
    form?: string
    nominative?: string
    dative?: string
}

export interface GrammarItem {
    id: string
    type: 'fill_blank' | 'conjugation_table' | 'declension_table'
    topic: string
    topic_explanation: string
    question: string
    question_translation: string
    options: string[]
    answer: string
    explanation: string
    related_table: RelatedTableRow[]
    week: string
}

export interface VocabItem {
    id: string
    word: string
    article: string | null
    plural: string | null
    pronunciation: string
    meaning: string
    example: string
    example_translation: string
    example_pronunciation: string
    tags: string[]
    week: string
}

export interface Alternative {
    phrase: string
    pronunciation: string
    nuance: string
}

export interface Response {
    text: string
    pronunciation: string
    translation: string
}

export interface ExpressionItem {
    id: string
    phrase: string
    pronunciation: string
    meaning: string
    usage: string
    alternatives: Alternative[]
    responses: Response[]
    week: string
}
