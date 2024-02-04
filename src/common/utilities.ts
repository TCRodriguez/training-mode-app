export const directionalInputSets = {
    'qcf': {
        name: 'Quarter Circle Forward',
        directions: [
            'Down', 'Down Forward', 'Forward'
        ]
    },
    'qcb': {
        name: 'Quarter Circle Back',
        directions: [
            'Down', 'Down Back', 'Back'
        ]
    },
    'hcf': {
        name: 'Half Circle Forward',
        directions: [
            'Back', 'Down Back', 'Down', 'Down Forward', 'Forward'
        ]
    },
    'hcb': {
        name: 'Half Circle Back',
        directions: [
            'Forward', 'Down Forward', 'Down', 'Down Back', 'Back'
        ]
    },
    'fcf': {
        name: 'Full Circle Forward',
        directions: [
            'Forward', 'Down Forward', 'Down', 'Down Back', 'Back', 'Up Back', 'Up', 'Up Forward', 'Forward'
        ]
    },
    'fcb': {
        name: 'Full Circle Back',
        directions: [
            'Back', 'Down Back', 'Down', 'Down Forward', 'Forward', 'Up Forward', 'Up', 'Up Back', 'Back'
        ]
    },
    'qcf + hcb': {
        name: 'Quarter Circle Forward + Half Circle Back',
        directions: [
            'Down', 'Down Forward', 'Forward', 'Down Forward', 'Down', 'Down Back', 'Back'
        ]
    },
    'qcb + hcf': {
        name: 'Quarter Circle Back + Half Circle Forward',
        directions: [
            'Down', 'Down Back', 'Back', 'Down Back', 'Down', 'Down Forward', 'Forward'
        ]
    },
    'dp': {
        name: 'Dragon Punch',
        directions: [
            'Forward', 'Down', 'Down Forward'
        ]
    },
    'rdp': {
        name: 'Reverse Dragon Punch',
        directions: [
            'Back', 'Down', 'Down Back'
        ]
    }
};

export type cannedDirectionalInputSetShorthand = 'qcf'
| 'qcb'
| 'hcf'
| 'hcb'
| 'fcf'
| 'fcb'
| 'qcf + hcb'
| 'qcb + hcf'
| 'dp'
| 'rdp';