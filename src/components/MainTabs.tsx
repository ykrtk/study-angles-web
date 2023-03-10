import styles from '@/styles/MainTabs.module.scss';

import { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import { PlayGroundAngleIndicator } from '@/components/PlayGroundAngleIndicator';
import { PlayGroundCanvas } from '@/components/PlayGroundCanvas';
import { PlayGroundDescription } from '@/components/PlayGroundDescription';
import { useTranslations } from 'next-intl';
import { AngleQuiz } from './AngleQuiz';

const THEME_COLOR = '#4682B4'; // 'steelblue'

interface MainTabProps {
    fontFamily: string;
    isDarkModeEnabled: boolean;
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

const getCustomTheme = (
    fontFamily: string,
    fontSize: string,
    isDarkMode: boolean
) =>
    createTheme({
        typography: {
            allVariants: {
                fontFamily: fontFamily,
                fontSize: fontSize,
                fontWeight: 'bold',
            },
        },
        palette: {
            mode: isDarkMode ? 'dark' : 'light',
            primary: {
                main: THEME_COLOR,
            },
        },
    });

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ padding: 3 }}>{children}</Box>}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export function MainTabs(props: MainTabProps) {
    const t = useTranslations('MainTabs');
    const [value, setValue] = useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <ThemeProvider
            theme={getCustomTheme(
                props.fontFamily,
                '100%',
                props.isDarkModeEnabled
            )}
        >
            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        aria-label={t('tabAriaLabel')}
                        variant="fullWidth"
                        textColor="primary"
                        TabIndicatorProps={{
                            sx: {
                                fontFamily: props.fontFamily,
                                backgroundColor: THEME_COLOR,
                            },
                        }}
                    >
                        <Tab
                            label={t('tabNameForPlayWithAngles')}
                            {...a11yProps(0)}
                        />
                        <Tab
                            label={t('tabNameForAngleQuiz')}
                            {...a11yProps(1)}
                        />
                    </Tabs>
                </Box>
                <TabPanel value={value} index={0}>
                    <section className={styles.playgroundcontainer}>
                        <div className={styles.playgroundfirstcolumn}>
                            <PlayGroundAngleIndicator />
                            <PlayGroundCanvas />
                        </div>
                        <div className={styles.playgrounddesc}>
                            <PlayGroundDescription />
                        </div>
                    </section>
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <AngleQuiz fontFamily={props.fontFamily} />
                </TabPanel>
            </Box>
        </ThemeProvider>
    );
}
