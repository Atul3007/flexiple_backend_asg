import bcrypt from 'bcrypt';

const saltRounds = 10;

const hashpass = async (myPlaintextPassword: string): Promise<string> => {
    const hash = await bcrypt.hash(myPlaintextPassword, saltRounds);
    return hash;
};

const comparePass = async (myPlaintextPassword: string, hash: string): Promise<boolean> => {
    const compare = await bcrypt.compare(myPlaintextPassword, hash);
    return compare;
};

export {
    hashpass,
    comparePass
};
