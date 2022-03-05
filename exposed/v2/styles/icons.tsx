import {
  AiFillFolder, AiFillFolderOpen, AiOutlineCluster,
  AiOutlinePlus
} from 'react-icons/ai';
import {GiMatterStates} from 'react-icons/gi';
import {HiOutlineViewGrid, HiVariable} from 'react-icons/hi';
import {IoMdCube} from 'react-icons/io';
import {MdOutlineQueryStats, MdOutlineRemove} from 'react-icons/md';
import {RiSettings2Line} from 'react-icons/ri';

export type Icons = "IconCluster" | "IconPipeline" | "IconContainer" |
  "IconSetting" | "IconMetrix" | "IconEnvVar" | "IconPlus" | "IconOverview" |
    "IconDelete" | "IconProject" | "IconProjectOpen";

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
