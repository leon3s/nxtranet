import {
  AiFillFolder,
  AiFillFolderOpen, AiOutlineCluster, AiOutlineEye, AiOutlinePlus, AiOutlineQuestionCircle
} from 'react-icons/ai';
import {FaMask, FaTerminal} from 'react-icons/fa';
import {GiMatterStates} from 'react-icons/gi';
import {GrTextAlignLeft} from 'react-icons/gr';
import {HiOutlineViewGrid, HiVariable} from 'react-icons/hi';
import {IoMdCube} from 'react-icons/io';
import {MdDangerous, MdOutlineQueryStats, MdOutlineRemove} from 'react-icons/md';
import {RiSettings2Line} from 'react-icons/ri';
import {SiDocker, SiNginx} from 'react-icons/si';
import {VscFile, VscFiles} from 'react-icons/vsc';

export const IconCluster = AiOutlineCluster;
export const IconPipeline = GiMatterStates;
export const IconContainer = IoMdCube;
export const IconSetting = RiSettings2Line;
export const IconMetrix = MdOutlineQueryStats;
export const IconEnvVar = HiVariable;
export const IconPlus = AiOutlinePlus;
export const IconOverview = HiOutlineViewGrid;
export const IconDelete = MdOutlineRemove;
export const IconProject = AiFillFolder;
export const IconProjectOpen = AiFillFolderOpen;
export const IconNginx = SiNginx;
export const IconWarning = MdDangerous;
export const IconConfirm = AiOutlineQuestionCircle;
export const IconPipelineCmd = FaTerminal;
export const IconDocker = SiDocker;
export const IconDnsmasq = FaMask;
export const IconContainerLog = GrTextAlignLeft;
export const IconContainerInspect = AiOutlineEye;
export const IconFile = VscFile;
export const IconFiles = VscFiles;

export type Icons = "IconCluster" | "IconPipeline" | "IconContainer" |
  "IconSetting" | "IconMetrix" | "IconEnvVar" | "IconPlus" | "IconOverview" |
  "IconDelete" | "IconProject" | "IconProjectOpen" | "IconNginx" | "IconWarning" |
  "IconConfirm" | "IconPipelineCmd" | "IconDocker" | "IconDnsmasq"
  | "IconContainerLog" | "IconContainerInspect" | "IconFile" | "IconFiles";
