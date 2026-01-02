import i18n from '../i18n';

export const formatTime = (hours: number, minutes: number): string => {
    const t = i18n.t;

    if (hours === 0 && minutes === 0) return '';
    if (hours > 11) return `12+ ${t('hours')}`;
    if (hours === 0) return `${minutes} ${t('min')}`;
    if (minutes === 0) return `${hours} ${t('hoursShort')}`;
    return `${hours} ${t('hoursShort')} ${minutes} ${t('min')}`;
};