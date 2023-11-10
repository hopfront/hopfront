import {existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync} from "fs";

const PERSISTENCE_ROOT_DIRECTORY = process.env.API_SPECS_DIRECTORY || '/etc/hopfront'

const buildDirectoryPath = (directory: string): string => {
    return PERSISTENCE_ROOT_DIRECTORY +
        (PERSISTENCE_ROOT_DIRECTORY.endsWith('/') ? '' : '/') +
        directory;
}

const buildFilePath = (directory: string, fileName: string): string => {
    return buildDirectoryPath(directory) + '/' + fileName;
}

export const listDirectoryChildren = (directory: string): string[] => {
    try {
        const directoryPath = buildDirectoryPath(directory);

        if (!existsSync(directoryPath)) {
            mkdirSync(directoryPath, {recursive: true});
        }

        return readdirSync(directoryPath);
    } catch (error: any) {
        console.log(`Failed to list children of directory=${directory}`, error);
        return [];
    }
}

export const writeFile = (directory: string, fileName: string, content: string) => {
    const directoryPath = buildDirectoryPath(directory);
    const filePath = buildFilePath(directory, fileName);

    try {
        if (!existsSync(directoryPath)) {
            mkdirSync(directoryPath, {recursive: true});
        }

        writeFileSync(filePath, content, {});
        console.log(`Wrote ${content.length} characters to file=${filePath}`);
    } catch (error: any) {
        console.log(`Failed to write to file=${filePath}`, error);
    }
}

export const fileExists = (directory: string, fileName: string): boolean => {
    const filePath = buildFilePath(directory, fileName);
    return existsSync(filePath);
}

export const readFile = (directory: string, fileName: string): string => {
    const filePath = buildFilePath(directory, fileName);
    const fileContentBuffer = readFileSync(filePath);
    return fileContentBuffer.toString();
}

export const deleteDirectory = (directory: string) => {
    const directoryPath = buildDirectoryPath(directory);
    rmSync(directoryPath, {recursive: true})
}

export const deleteFile = (directory: string, fileName: string) => {
    const filePath = buildFilePath(directory, fileName)
    rmSync(filePath);
}