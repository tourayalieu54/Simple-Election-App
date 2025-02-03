export default class CustomError extends Error {

    constructor(message, errorCode, statuscodeNumber) {
        super(message);
        this.errorCode = errorCode;
        this.statuscodeNumber = statuscodeNumber;
        this.isCustomError = true;
        this.name = this.constructor.name;  // Helps identify it as a CustomError
    }
}

// error codes
export const ErrorCodes = {
    STUDENT_CANDIDATE_CONFLICT: 'STUDENT_CANDIDATE_CONFLICT',
    STUDENT_OFFICER_CONLFICT: 'STUDENT_OFFICER_CONFLICT',
    CANDIDATE_OFFICER_CONFLICT: 'CANDIDATE_OFFICER_CONFLICT',
    NOT_FOUND: 'NOT_FOUND',
    MISSING_REQUIRED_FIELD: 'MISSING_REQUIRED_FIELD',
    INVALID_PASSWORD_FORMAT: 'INVALID_PASSWORD_FORMAT',
    INVALID_ROLE: 'INVALID_ROLE',
    USERNAME_EXISTS: 'USERNAME_EXISTS',
    DUPLICATE_USER_ID: 'DUPLICATE_USER_ID',
    NO_ACTIVE_ELECTION: 'NO_ACTIVE_ELECTION',
    DUPLICATE_PARTY_POSITION_CANDIDATE: 'DUPLICATE_PARTY_POSITION_CANDIDATE',
    ONGOING_ELECTION: 'ONGOING ELECTION',
    OUT_OF_RANGE: 'OUT_OF_RANGE',
    ELECTION_TIMEOUT: 'ELECTION_TIMEOUT',
    ELECTION_TIME_NOT_MET: 'ELECTION_TIME_NOT_MET',
    POSITION_VOTE_DUPLICATION: 'POSITION_VOTE_DUPLICATION',
};
