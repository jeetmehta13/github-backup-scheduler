import UserPrompts from '../assets/user-prompts';


export function parseFrequencyString (freqString: string): string {
  if(freqString == null) throw new Error('Empty string provided');

  if(freqString.length < 2) throw new Error(UserPrompts.invalidFrequencyError);
  
  const freqDuration: string = freqString.slice(-1)
  const freqValue: string = freqString.slice(0, -1);
  
  if(freqDuration != 'h' && freqDuration != 'm') {
    throw new Error(UserPrompts.invalidFrequencyError);
  }
  
  const freqValueNum: number = Number(freqValue);

  if (isNaN(freqValueNum)){
    throw new Error(UserPrompts.invalidFrequencyError);
  }

  if(freqDuration == 'h') {
    return `*/${freqValueNum} * * *`;
  } 
  return `*/${freqValueNum} * * * *`;
}

export function parseRepositoryUrl (githubUrl: string) {
  const splitted: string[] = githubUrl.split('/');
  return `${splitted.at(-2)}/${splitted.at(-1)}`;
}