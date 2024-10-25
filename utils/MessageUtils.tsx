import PropTypes from 'prop-types';

export const MessageShape = PropTypes.shape({
    id: PropTypes.number.isRequired,
    type: PropTypes.oneOf(['text', 'image', 'location']),
    text: PropTypes.string,
    uri: PropTypes.string,
    coordinate: PropTypes.shape({
        latitude: PropTypes.number.isRequired,
        longitude: PropTypes.number.isRequired
    })
});

let messageId = 0;

function getNextId() {
    messageId += 1;
    return messageId;
}

export function createTextMessage(text: string) {
    return {
        type: 'text',
        id: getNextId(),
        text
    };
}

export function createImageMessage(uri: string) {
    return {
        type: 'image',
        id: getNextId(),
        uri
    };
}

export function createLocationMessage(coordinate: { latitude: number, longitude: number }) {
    return {
        type: 'location',
        id: getNextId(),
        coordinate
    };
}