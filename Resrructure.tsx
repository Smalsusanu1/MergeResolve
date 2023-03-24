import * as React from 'react';
import * as $ from 'jquery';
import Modal from 'react-bootstrap/Modal';
import * as Moment from 'moment';
import Button from 'react-bootstrap/Button';
import { map } from 'jquery';
// import { Modal } from 'office-ui-fabric-react';
import "bootstrap/dist/css/bootstrap.min.css";
import { FaAngleDown, FaAngleUp, FaPrint, FaFileExcel, FaPaintBrush, FaEdit, FaSearch, FaFilter, FaRegTimesCircle } from 'react-icons/fa';
import { MdAdd } from 'react-icons/Md';
import Tooltip from '../../../globalComponents/Tooltip';
import Dropdown from 'react-bootstrap/Dropdown';
import EditInstituton from '../../EditPopupFiles/EditComponent'
import { create } from 'lodash';
import EditTaskPopup from '../../../globalComponents/EditTaskPopup/EditTaskPopup';
// import TimeEntryPopup from '../../../globalComponents/TimeEntry/TimeEntryPopup';
import TimeEntryPopup from '../../../globalComponents/TimeEntry/TimeEntryComponent';
import * as globalCommon from '../../../globalComponents/globalCommon';
import { GlobalConstants } from '../../../globalComponents/LocalCommon';
import pnp, { Web, SearchQuery, SearchResults, UrlException } from "sp-pnp-js";
import PortfolioStructureCreationCard from '../../../globalComponents/tableControls/PortfolioStructureCreation';
import ShowTaskTeamMembers from '../../../globalComponents/ShowTaskTeamMembers';
// import SmartTimeTotal from '../../taskprofile/components/SmartTimeTotal';
import ExpndTable from '../../../globalComponents/ExpandTable/Expandtable';
import { Panel, PanelType } from 'office-ui-fabric-react';
import CreateActivity from '../../servicePortfolio/components/CreateActivity';
import CreateWS from '../../servicePortfolio/components/CreateWS';
import { RiDeleteBin6Line, RiH6 } from 'react-icons/ri'
import { Item } from '@pnp/sp/items';
var filt: any = '';
var siteConfig: any = [];
var IsUpdated: any = '';
let serachTitle: any = '';
var MeetingItems: any = []
var MainMeetingItems: any = []
var childsData: any = []
var array: any = [];
var selectedCategory: any = [];
var AllItems: any = [];
export default function ComponentTable({ props }: any) {
    const [maidataBackup, setmaidataBackup] = React.useState([])
    const [search, setSearch]: [string, (search: string) => void] = React.useState("");
    const [data, setData] = React.useState([])
    const [Title, setTitle] = React.useState()
    const [ComponentsData, setComponentsData] = React.useState([])
    const [SubComponentsData, setSubComponentsData] = React.useState([])
    const [FeatureData, setFeatureData] = React.useState([])
    const [table, setTable] = React.useState(data);
    const [AllUsers, setTaskUser] = React.useState([]);
    const [modalIsOpen, setModalIsOpen] = React.useState(false);
    const [addModalOpen, setAddModalOpen] = React.useState(false);
    const [state, setState] = React.useState([]);
    const [filterGroups, setFilterGroups] = React.useState([])
    const [filterItems, setfilterItems] = React.useState([])
    // const [AllMetadata, setMetadata] = React.useState([])
    const [IsComponent, setIsComponent] = React.useState(false);
    const [SharewebComponent, setSharewebComponent] = React.useState('');
    const [IsTask, setIsTask] = React.useState(false);
    const [SharewebTask, setSharewebTask] = React.useState('');
    const [SharewebTimeComponent, setSharewebTimeComponent] = React.useState([])
    const [IsTimeEntry, setIsTimeEntry] = React.useState(false);
    const [ShowSelectdSmartfilter, setShowSelectdSmartfilter] = React.useState([]);
    const [checked, setchecked] = React.useState([]);
    const [checkedList, setCheckedList] = React.useState([]);
    const [Isshow, setIsshow] = React.useState(false);
    const [tablecontiner, settablecontiner]: any = React.useState("hundred");
    const [MeetingPopup, setMeetingPopup] = React.useState(false);
    const [WSPopup, setWSPopup] = React.useState(false);
    const [ActivityPopup, setActivityPopup] = React.useState(false);
    const [ActivityDisable, setActivityDisable] = React.useState(false);
    const [OldArrayBackup, setOldArrayBackup] = React.useState([]);
    //  For selected client category
    const [items, setItems] = React.useState<any>([]);

    function handleClick(item: any) {
        const index = items.indexOf(item);
        if (index !== -1) {
            // Item already exists, remove it
            const newItems = [...items];
            newItems.splice(index, 1);
            setItems(newItems);
        } else {
            // Item doesn't exist, add it
            items.Title = item.Title
            items.Id = item.Id
            setItems([...items, item]);
        }
    }




    //--------------SmartFiltrt--------------------------------------------------------------------------------------------------------------------------------------------------
    IsUpdated = props?.Portfolio_x0020_Type;
    // for smarttime


    //Open activity popup
    const onRenderCustomHeaderMain = () => {
        return (
            <div className="d-flex full-width pb-1" >
                <div style={{ marginRight: "auto", fontSize: "20px", fontWeight: "600", marginLeft: '20px' }}>
                    <span>
                        {`Create Activity ${MeetingItems[0]?.Title}`}
                    </span>
                </div>
                <Tooltip ComponentId={MeetingItems[0]?.Id} />
            </div>
        );
    };


    var IsExitSmartfilter = function (array: any, Item: any) {
        var isExists = false;
        var count = 0;
        Item.MultipleTitle = '';
        map(array, (item) => {
            if (item.TaxType != undefined && Item.Title != undefined && item.TaxType == Item.Title) {
                isExists = true;
                count++;
                Item.MultipleTitle += item.Title + ', ';
                return false;
            }
        });
        if (Item.MultipleTitle != "")
            Item.MultipleTitle = Item.MultipleTitle.substring(0, Item.MultipleTitle.length - 2);
        Item.count = count;
        return isExists;
    }


    var issmartExists = function (array: any, title: any) {
        var isExists = false;
        map(array, (item) => {
            if (item.Title == title.Title) {
                isExists = true;
                return false;
            }
        });
        return isExists;
    }

    const Clearitem = () => {
        // setData(maini...[maidataBackup])
        setData(maidataBackup)
        // const { checked } = e.target;

    }


    const groupbyTasks = function (TaskArray: any, item: any) {
        item.childs = item.childs != undefined ? item.childs : [];
        // TaskArray.forEach((activ: any) => {
        //  if (activ.ParentTask?.Id != undefined) {
        let Allworkstream = $.grep(AllTasks, function (type: any) { return type.ParentTask?.Id == item.Id });
        if (Allworkstream != undefined && Allworkstream.length > 0) {
            Allworkstream.forEach((activ: any) => {
                if (activ.ParentTask?.Id != undefined) {
                    activ.tagged = true;
                    activ.show = true;
                    item.downArrowIcon = IsUpdated != undefined && IsUpdated == 'Service' ? GlobalConstants.MAIN_SITE_URL + '/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png' : GlobalConstants.MAIN_SITE_URL + '/SP/SiteCollectionImages/ICONS/24/list-icon.png';
                    item.RightArrowIcon = IsUpdated != undefined && IsUpdated == 'Service' ? GlobalConstants.MAIN_SITE_URL + '/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png' : GlobalConstants.MAIN_SITE_URL + '/SP/SiteCollectionImages/ICONS/24/right-list-icon.png';

                    item.childs.push(activ);
                    activ.childs = activ.childs != undefined ? activ.childs : [];
                    let Allworkstream = $.grep(AllTasks, function (type: any) { return type.ParentTask?.Id == activ.Id }); {
                        if (Allworkstream != undefined && Allworkstream.length > 0) {
                            Allworkstream.forEach((subactiv: any) => {
                                subactiv.tagged = true;
                                activ.downArrowIcon = IsUpdated != undefined && IsUpdated == 'Service' ? GlobalConstants.MAIN_SITE_URL + '/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png' : GlobalConstants.MAIN_SITE_URL + '/SP/SiteCollectionImages/ICONS/24/list-icon.png';
                                activ.RightArrowIcon = IsUpdated != undefined && IsUpdated == 'Service' ? GlobalConstants.MAIN_SITE_URL + '/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png' : GlobalConstants.MAIN_SITE_URL + '/SP/SiteCollectionImages/ICONS/24/right-list-icon.png';

                                activ.childs.push(subactiv);
                            })
                        }
                    }
                } else { activ.tagged = true; item.childs.push(activ); }
            })
        }
        // }

        // })

    }


    const LoadAllSiteTasks = function (filterarray: any) {
        var Response: any = []
        var Counter = 0;
        filterarray.forEach((filter: any) => {
            map(siteConfig, async (config: any) => {
                if (config.Title != 'Master Tasks' && config.Title != 'SDC Sites') {
                    try {

                        let AllTasksMatches = [];
                        var select = "SharewebTaskLevel2No,ParentTask/Title,ParentTask/Id,Services/Title,ClientTime,SharewebTaskLevel1No,Services/Id,Events/Id,Events/Title,ItemRank,Portfolio_x0020_Type,TimeSpent,BasicImageInfo,CompletedDate,Shareweb_x0020_ID, Responsible_x0020_Team/Id,Responsible_x0020_Team/Title,SharewebCategories/Id,SharewebCategories/Title,ParentTask/Shareweb_x0020_ID,SharewebTaskType/Id,SharewebTaskType/Title,SharewebTaskType/Level, Priority_x0020_Rank, Team_x0020_Members/Title, Team_x0020_Members/Name, Component/Id,Component/Title,Component/ItemType, Team_x0020_Members/Id, Item_x002d_Image,component_x0020_link,IsTodaysTask,AssignedTo/Title,AssignedTo/Name,AssignedTo/Id,  ClientCategory/Id, ClientCategory/Title, FileLeafRef, FeedBack, Title, Id, PercentComplete,StartDate, DueDate, Comments, Categories, Status, Body, Mileage,PercentComplete,ClientCategory,Priority,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title&$expand=ParentTask,Events,Services,SharewebTaskType,AssignedTo,Component,ClientCategory,Author,Editor,Team_x0020_Members,Responsible_x0020_Team,SharewebCategories&$filter=" + filter + ""
                        AllTasksMatches = await globalCommon.getData(GlobalConstants.SP_SITE_URL, config.listId, select)
                        console.log(AllTasksMatches);
                        Counter++;
                        console.log(AllTasksMatches.length);
                        if (AllTasksMatches != undefined && AllTasksMatches.length > 0) {

                            $.each(AllTasksMatches, function (index: any, item: any) {
                                item.isDrafted = false;
                                item.flag = true;
                                item.siteType = config.Title;
                                item.childs = [];
                                item.TitleNew = item.Title;
                                item.listId = config.listId;
                                // item.Item_x0020_Type = 'Task';
                                item.siteUrl = GlobalConstants.SP_SITE_URL;
                                if (item.SharewebCategories != undefined) {
                                    if (item.SharewebCategories.length > 0) {
                                        $.each(item.SharewebCategories, function (ind: any, value: any) {
                                            if (value.Title.toLowerCase() == 'draft') {
                                                item.isDrafted = true;
                                            }
                                        });
                                    }
                                }
                            })
                        }
                        AllTasks = AllTasks.concat(AllTasksMatches);
                        AllTasks = $.grep(AllTasks, function (type: any) { return type.isDrafted == false });


                        if (Counter === (filterarray.length === 1 ? siteConfig.length : (siteConfig.length * filterarray.length))) {

                            map(AllTasks, (result: any) => {
                                //   result.TeamLeader = []
                                result.CreatedDateImg = []
                                result.TeamLeaderUserTitle = ''
                                //  result.AllTeamMembers = []
                                result.Display = 'none'
                                result.DueDate = Moment(result.DueDate).format('DD/MM/YYYY')

                                if (result.DueDate == 'Invalid date' || '') {
                                    result.DueDate = result.DueDate.replaceAll("Invalid date", "")
                                }
                                result.PercentComplete = (result.PercentComplete * 100).toFixed(0);

                                if (result.Short_x0020_Description_x0020_On != undefined) {
                                    result.Short_x0020_Description_x0020_On = result.Short_x0020_Description_x0020_On.replace(/(<([^>]+)>)/ig, '');
                                }

                                // if (result.AssignedTo != undefined && result.AssignedTo.length > 0) {
                                //     map(result.AssignedTo, (Assig: any) => {
                                //         if (Assig.Id != undefined) {
                                //             map(TaskUsers, (users: any) => {

                                //                 if (Assig.Id != undefined && users.AssingedToUser != undefined && Assig.Id === users.AssingedToUser.Id) {
                                //                     users.ItemCover = users.Item_x0020_Cover?.Url;
                                //                     result.AllTeamMembers.push(users);
                                //                 }

                                //             })
                                //         }
                                //     })
                                // }
                                // if (result.Team_x0020_Members != undefined && result.Team_x0020_Members != undefined && result.Team_x0020_Members.length > 0) {
                                //     map(result.Team_x0020_Members, (obj: any) => {
                                //         if (obj.Id != undefined) {
                                //             map(TaskUsers, (users: any) => {
                                //                 if (obj.Id != undefined && users.AssingedToUser != undefined && obj.Id == users.AssingedToUser.Id) {
                                //                     users.ItemCover = users.Item_x0020_Cover?.Url;
                                //                     result.AllTeamMembers.push(users);
                                //                 }

                                //             })
                                //         }
                                //     })
                                // }
                                // if (result.Responsible_x0020_Team != undefined && result.Responsible_x0020_Team != undefined && result.Responsible_x0020_Team.length > 0) {
                                //     map(result.Responsible_x0020_Team, (resp: any) => {
                                //         if (resp.Id != undefined) {
                                //             map(TaskUsers, (users: any) => {
                                //                 if (resp.Id != undefined && users.AssingedToUser != undefined && resp.Id == users.AssingedToUser.Id) {
                                //                     users.ItemCover = users.Item_x0020_Cover?.Url;
                                //                     result.TeamLeader.push(users);
                                //                 }

                                //             })
                                //         }
                                //     })
                                // }
                                if (result.Author != undefined) {
                                    if (result.Author.Id != undefined) {
                                        $.each(TaskUsers, function (index: any, users: any) {
                                            if (result.Author.Id != undefined && users.AssingedToUser != undefined && result.Author.Id == users.AssingedToUser.Id) {
                                                users.ItemCover = users.Item_x0020_Cover.Url;
                                                result.CreatedDateImg.push(users);
                                            }
                                        })
                                    }
                                }
                                result['SiteIcon'] = globalCommon.GetIconImageUrl(result.siteType, GlobalConstants.MAIN_SITE_URL + '/SP', undefined);
                                if (result.ClientCategory != undefined && result.ClientCategory.length > 0) {
                                    map(result.Team_x0020_Members, (catego: any) => {
                                        result.ClientCategory.push(catego);
                                    })
                                }
                                if (result.Id === 498 || result.Id === 104)
                                    console.log(result);
                                result['Shareweb_x0020_ID'] = globalCommon.getTaskId(result);
                                if (result['Shareweb_x0020_ID'] == undefined) {
                                    result['Shareweb_x0020_ID'] = "";
                                }
                                result['Item_x0020_Type'] = 'Task';

                                result.Portfolio_x0020_Type = 'Component';
                                TasksItem.push(result);
                            })
                            let AllAcivities = $.grep(AllTasks, function (type: any) { return type.SharewebTaskType?.Title == 'Activities' });
                            if (AllAcivities != undefined && AllAcivities.length > 0) {
                                AllAcivities.forEach((activ: any) => {
                                    if (activ.Id != undefined) {
                                        groupbyTasks(AllTasks, activ);
                                        AllTasks.forEach((obj: any) => {
                                            if (obj.Id === activ.Id) {
                                                obj.show = false;
                                                obj.childs = activ.childs;
                                                obj.childsLength = activ.childs.length;
                                            }

                                        })
                                    }

                                })

                            }
                            AllTasks = $.grep(AllTasks, function (type: any) { return type.tagged != true });
                            TasksItem = (AllTasks);
                            console.log(Response);
                            map(TasksItem, (task: any) => {
                                if (!isItemExistsNew(CopyTaskData, task)) {
                                    CopyTaskData.push(task);
                                }
                            })

                            // bindData();
                            makeFinalgrouping();
                        }

                    } catch (error) {
                        console.log(error)
                    }
                } else Counter++;

            })
        })
    }

    const handleOpen = (item: any) => {

        item.show = item.show = item.show == true ? false : true;
        setData(maidataBackup => ([...maidataBackup]));

    };

    const handleOpenAll = () => {
        var Isshow1: any = Isshow == true ? false : true;
        map(data, (obj) => {
            obj.show = Isshow1;
            if (obj.childs != undefined && obj.childs.length > 0) {
                map(obj.childs, (subchild) => {
                    subchild.show = Isshow1;
                    if (subchild.childs != undefined && subchild.childs.length > 0) {
                        map(subchild.childs, (child) => {
                            child.show = Isshow1;
                        })

                    }
                })

            }

        })
        setIsshow(Isshow1);
        setData(data => ([...data]));
    };

    const addModal = () => {
        setAddModalOpen(true)
    }
    const setModalIsOpenToTrue = () => {
        setModalIsOpen(true)
    }


    const sortBy = () => {

        const copy = data

        copy.sort((a, b) => (a.Title > b.Title) ? 1 : -1);

        setTable(copy)

    }
    const sortByDng = () => {

        const copy = data

        copy.sort((a, b) => (a.Title > b.Title) ? -1 : 1);

        setTable(copy)

    }



    // Global Search 
    var getRegexPattern = function (keywordArray: any) {
        var pattern = "(^|\\b)(" + keywordArray.join("|") + ")";
        return new RegExp(pattern, "gi");
    };
    var getHighlightdata = function (item: any, searchTerms: any) {
        var keywordList = [];
        if (serachTitle != undefined && serachTitle != '') {
            keywordList = stringToArray(serachTitle);
        } else {
            keywordList = stringToArray(serachTitle);
        }
        var pattern: any = getRegexPattern(keywordList);
        //let Title :any =(...item.Title)
        item.TitleNew = item.Title;
        item.TitleNew = item.Title.replace(pattern, '<span class="highlighted">$2</span>');
        // item.Title = item.Title;
        keywordList = [];
        pattern = '';
    }
    var getSearchTermAvialable1 = function (searchTerms: any, item: any, Title: any) {
        var isSearchTermAvailable = true;
        $.each(searchTerms, function (index: any, val: any) {
            if (isSearchTermAvailable && (item[Title] != undefined && item[Title].toLowerCase().indexOf(val.toLowerCase()) > -1)) {
                isSearchTermAvailable = true;
                getHighlightdata(item, val.toLowerCase());

            } else
                isSearchTermAvailable = false;
        })
        return isSearchTermAvailable;
    }


    var stringToArray = function (input: any) {
        if (input) {
            return input.match(/\S+/g);
        } else {
            return [];
        }
    };


    var isItemExistsNew = function (array: any, items: any) {
        var isExists = false;
        $.each(array, function (index: any, item: any) {
            if (item.Id === items.Id && items.siteType === item.siteType) {
                isExists = true;
                return false;
            }
        });
        return isExists;
    }
    let handleChange1 = (e: { target: { value: string; }; }, titleName: any) => {
        setSearch(e.target.value.toLowerCase());
        var Title = titleName;

        var AllFilteredTagNews = [];
        var filterglobal = e.target.value.toLowerCase();
        if (filterglobal != undefined && filterglobal.length >= 1) {
            var searchTerms = stringToArray(filterglobal);
            $.each(data, function (pareIndex: any, item: any) {
                item.flag = false;
                item.isSearch = true;
                item.show = false;
                item.flag = (getSearchTermAvialable1(searchTerms, item, Title));
                if (item.childs != undefined && item.childs.length > 0) {
                    $.each(item.childs, function (parentIndex: any, child1: any) {
                        child1.flag = false;
                        child1.isSearch = true;
                        child1.flag = (getSearchTermAvialable1(searchTerms, child1, Title));
                        if (child1.flag) {
                            item.childs[parentIndex].flag = true;
                            data[pareIndex].flag = true;
                            item.childs[parentIndex].show = true;
                            data[pareIndex].show = true;
                        }
                        if (child1.childs != undefined && child1.childs.length > 0) {
                            $.each(child1.childs, function (index: any, subchild: any) {
                                subchild.flag = false;
                                subchild.flag = (getSearchTermAvialable1(searchTerms, subchild, Title));
                                if (subchild.flag) {
                                    item.childs[parentIndex].flag = true;
                                    child1.flag = true;
                                    child1.childs[index].flag = true;
                                    child1.childs[index].show = true;
                                    item.childs[parentIndex].show = true;
                                    data[pareIndex].flag = true;
                                    data[pareIndex].show = true;
                                }
                                if (subchild.childs != undefined && subchild.childs.length > 0) {
                                    $.each(subchild.childs, function (childindex: any, subchilds: any) {
                                        subchilds.flag = false;
                                        // subchilds.Title = subchilds.newTitle;
                                        subchilds.flag = (getSearchTermAvialable1(searchTerms, subchilds, Title));
                                        if (subchilds.flag) {
                                            item.childs[parentIndex].flag = true;
                                            child1.flag = true;
                                            subchild.flag = true;
                                            subchild.childs[childindex].flag = true;
                                            child1.childs[index].flag = true;
                                            child1.childs[index].show = true;
                                            item.childs[parentIndex].show = true;
                                            data[pareIndex].flag = true;
                                            data[pareIndex].show = true;
                                        }
                                    })
                                }
                            })
                        }

                    })
                }
            })
            //   getFilterLength();
        } else {
            //  ungetFilterLength();
            // setData(data => ([...maidataBackup]));
            setData(maidataBackup);
            //setData(ComponentsData)= SharewebCommonFactoryService.ArrayCopy($scope.CopyData);
        }
        // console.log($scope.ComponetsData['allComponentItemWithStructure']);

    };


    // var TaxonomyItems: any = [];
    var AllComponetsData: any = [];
    var TaskUsers: any = [];
    // var RootComponentsData: any = [];
    // var ComponentsData: any = [];
    // var SubComponentsData: any = []; var FeatureData: any = [];
    var MetaData: any = []
    var showProgressBar = () => {
        $(' #SpfxProgressbar').show();
    }

    var showProgressHide = () => {
        $(' #SpfxProgressbar').hide();
    }
    var Response: any = []
    const getTaskUsers = async () => {
        let taskUsers = Response = TaskUsers = await globalCommon.loadTaskUsers();
        setTaskUser(Response);
        console.log(Response);

    }
    const GetSmartmetadata = async () => {
        var metadatItem: any = []
        let smartmetaDetails: any = [];
        var select: any = 'Id,Title,IsVisible,ParentID,SmartSuggestions,TaxType,Description1,Item_x005F_x0020_Cover,listId,siteName,siteUrl,SortOrder,SmartFilters,Selectable,Parent/Id,Parent/Title&$expand=Parent'
        smartmetaDetails = await globalCommon.getData(GlobalConstants.SP_SITE_URL, GlobalConstants.SMARTMETADATA_LIST_ID, select);
        console.log(smartmetaDetails);
        // setMetadata(smartmetaDetails => ([...smartmetaDetails]));
        map(smartmetaDetails, (newtest) => {
            newtest.Id = newtest.ID;
            // if (newtest.ParentID == 0 && newtest.TaxType == 'Client Category') {
            //     TaxonomyItems.push(newtest);
            // }
            if (newtest.TaxType == 'Sites' && newtest.Title != 'Master Tasks' && newtest.Title != 'SDC Sites') {
                siteConfig.push(newtest)
            }
        });
        map(siteConfig, (newsite) => {
            if (newsite.Title == "SDC Sites" || newsite.Title == "DRR" || newsite.Title == "Small Projects" || newsite.Title == "Offshore Tasks" || newsite.Title == "Health" || newsite.Title == "Shareweb Old" || newsite.Title == "Master Tasks")
                newsite.DataLoadNew = false;
            else
                newsite.DataLoadNew = true;
            /*-- Code for default Load Task Data---*/
            if (newsite.Title == "DRR" || newsite.Title == "Small Projects" || newsite.Title == "Gruene" || newsite.Title == "Offshore Tasks" || newsite.Title == "Health" || newsite.Title == "Shareweb Old") {

                newsite.Selected = false;
            }
            else {
                newsite.Selected = true;
            }
        })

    }
    const GetComponents = async () => {
        filt = "(Item_x0020_Type eq 'Component') or (Item_x0020_Type eq 'SubComponent') or (Item_x0020_Type eq 'Feature') and ((Portfolio_x0020_Type eq 'Service'))";
        if (IsUpdated != undefined && IsUpdated.toLowerCase().indexOf('service') > -1)
            filt = "((Item_x0020_Type eq 'Component') or (Item_x0020_Type eq 'SubComponent') or (Item_x0020_Type eq 'Feature')) and ((Portfolio_x0020_Type eq 'Service'))";
        if (IsUpdated != undefined && IsUpdated.toLowerCase().indexOf('events') > -1)
            filt = "((Item_x0020_Type eq 'Component') or (Item_x0020_Type eq 'SubComponent') or (Item_x0020_Type eq 'Feature')) and ((Portfolio_x0020_Type eq 'Events'))";
        if (IsUpdated != undefined && IsUpdated.toLowerCase().indexOf('component') > -1)
            filt = "((Item_x0020_Type eq 'Component') or (Item_x0020_Type eq 'SubComponent') or (Item_x0020_Type eq 'Feature')) and ((Portfolio_x0020_Type eq 'Component'))";

        let componentDetails: any = [];
        var select = "ID,Id,Title,Mileage,TaskListId,TaskListName,PortfolioLevel,PortfolioStructureID,PortfolioStructureID,component_x0020_link,Package,Comments,DueDate,Sitestagging,Body,Deliverables,StartDate,Created,Item_x0020_Type,Help_x0020_Information,Background,Categories,Short_x0020_Description_x0020_On,CategoryItem,Priority_x0020_Rank,Priority,TaskDueDate,PercentComplete,Modified,CompletedDate,ItemRank,Portfolio_x0020_Type,Services/Title, ClientTime,Services/Id,Events/Id,Events/Title,Parent/Id,Parent/Title,Component/Id,Component/Title,Component/ItemType,Services/Id,Services/Title,Services/ItemType,Events/Id,Author/Title,Editor/Title,Events/Title,Events/ItemType,SharewebCategories/Id,SharewebTaskType/Title,SharewebCategories/Title,AssignedTo/Id,AssignedTo/Title,Team_x0020_Members/Id,Team_x0020_Members/Title,ClientCategory/Id,ClientCategory/Title,Responsible_x0020_Team/Id,Responsible_x0020_Team/Title&$expand=Parent,Events,Services,SharewebTaskType,AssignedTo,Component,ClientCategory,Author,Editor,Team_x0020_Members,Responsible_x0020_Team,SharewebCategories&$filter=" + filt + "";

        componentDetails = await globalCommon.getData(GlobalConstants.SP_SITE_URL, GlobalConstants.MASTER_TASKS_LISTID, select);
        console.log(componentDetails);
        var array: any = [];
        if (props.Item_x0020_Type != undefined && props.Item_x0020_Type === 'Component') {
            array = $.grep(componentDetails, function (compo: any) { return compo.Id === props.Id })
            let temp: any = $.grep(componentDetails, function (compo: any) { return compo.Parent?.Id === props.Id })
            array = [...array, ...temp];
            temp.forEach((obj: any) => {
                if (obj.Id != undefined) {
                    var temp1: any = $.grep(componentDetails, function (compo: any) { return compo.Parent?.Id === obj.Id })
                    if (temp1 != undefined && temp1.length > 0)
                        array = [...array, ...temp1];
                }
            })
        }
        if (props.Item_x0020_Type != undefined && props.Item_x0020_Type === 'SubComponent') {
            array = $.grep(componentDetails, function (compo: any) { return compo.Id === props.Id })
            let temp = $.grep(componentDetails, function (compo: any) { return compo.Parent?.Id === props.Id })
            if (temp != undefined && temp.length > 0)
                array = [...array, ...temp];
        }
        if (props.Item_x0020_Type != undefined && props.Item_x0020_Type === 'Feature') {
            array = $.grep(componentDetails, function (compo: any) { return compo.Id === props.Id })
        }

        AllComponetsData = array;
        ComponetsData['allComponets'] = array;

        var arrayfilter: any = [];
        const Itmes: any = [];
        const chunkSize = 20;
        for (let i = 0; i < AllComponetsData.length; i += chunkSize) {
            const chunk = AllComponetsData.slice(i, i + chunkSize);
            if (chunk != undefined && chunk.length > 0) {
                var filter: any = '';
                if (IsUpdated === 'Service' && chunk != undefined && chunk.length > 0) {
                    chunk.forEach((obj: any, index: any) => {
                        if ((chunk.length - 1) === index)
                            filter += '(Services/Id eq ' + obj.Id + ' )'
                        else filter += '(Services/Id eq ' + obj.Id + ' ) or '

                    })

                }
                if (IsUpdated === 'Component' && chunk != undefined && chunk.length > 0) {
                    chunk.forEach((obj: any, index: any) => {
                        if ((chunk.length - 1) === index)
                            filter += '(Component/Id eq ' + obj.Id + ' )'
                        else filter += '(Component/Id eq ' + obj.Id + ' ) or '

                    })
                }
                if (IsUpdated === 'Events' && chunk != undefined && chunk.length > 0) {
                    chunk.forEach((obj: any, index: any) => {
                        if ((chunk.length - 1) === index)
                            filter += '(Events/Id eq ' + obj.Id + ' )'
                        else filter += '(Events/Id eq ' + obj.Id + ' ) or '



                    })
                }

                Itmes.push(filter);
            }
            // do whatever
        }




        LoadAllSiteTasks(Itmes);
    }

    //const [IsUpdated, setIsUpdated] = React.useState(SelectedProp.SelectedProp);
    React.useEffect(() => {
        //MainMeetingItems.push(props) 
        showProgressBar();
        getTaskUsers();
        GetSmartmetadata();
        //LoadAllSiteTasks();
        GetComponents();
    }, [])
    // common services

    var parseJSON = function (jsonItem: any) {
        var json = [];
        try {
            json = JSON.parse(jsonItem);
        } catch (err) {
            console.log(err);
        }
        return json;
    };

    var ArrayCopy = function (array: any) {
        let MainArray = [];
        if (array != undefined && array.length != undefined) {
            MainArray = parseJSON(JSON.stringify(array));
        }
        return MainArray;
    }
    var stringToArray1 = function (input: any) {
        if (input) {
            return input.split('>');
        } else {
            return [];
        }
    };
    var getRegexPattern = function (keywordArray: any) {
        var pattern = "(^|\\b)(" + keywordArray.join("|") + ")";
        return new RegExp(pattern, "gi");
    };


    const getTeamLeadersName = function (Items: any, Item: any) {
        if (Items != undefined) {
            map(Items.results, (index: any, user: any) => {
                $.each(AllUsers, function (index: any, item: any) {
                    $.each(AllUsers, function (index: any, item: any) {
                        if (user.Id === item.AssingedToUser?.Id) {
                            Item.AllTeamName = Item.AllTeamName + item.Title + ' ';
                        }
                    });
                })
            })
        }
    }
    var AllTasks: any = [];
    var CopyTaskData: any = [];
    var isItemExistsNew = function (array: any, items: any) {
        var isExists = false;
        $.each(array, function (index: any, item: any) {
            if (item.Id === items.Id && items.siteType === item.siteType) {
                isExists = true;
                return false;
            }
        });
        return isExists;
    }
    const findTaggedComponents = function (task: any) {
        task.Portfolio_x0020_Type = 'Component';
        task.isService = false;
        if (IsUpdated === 'Service') {
            $.each(task['Services'], function (index: any, componentItem: any) {
                for (var i = 0; i < ComponetsData['allComponets'].length; i++) {
                    let crntItem = ComponetsData['allComponets'][i];
                    if (componentItem.Id == crntItem.Id) {
                        if (crntItem.PortfolioStructureID != undefined && crntItem.PortfolioStructureID != '') {
                            task.PortfolioStructureID = crntItem.PortfolioStructureID;
                            task.ShowTooltipSharewebId = crntItem.PortfolioStructureID + '-' + task.Shareweb_x0020_ID;
                        }
                        if (crntItem.Portfolio_x0020_Type == 'Service') {
                            task.isService = true;
                            task.Portfolio_x0020_Type = 'Service';
                        }
                        if (ComponetsData['allComponets'][i]['childs'] === undefined)
                            ComponetsData['allComponets'][i]['childs'] = [];
                        if (!isItemExistsNew(ComponetsData['allComponets'][i]['childs'], task)) {
                            ComponetsData['allComponets'][i].downArrowIcon = IsUpdated != undefined && IsUpdated == 'Service' ? GlobalConstants.MAIN_SITE_URL + '/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png' : GlobalConstants.MAIN_SITE_URL + '/SP/SiteCollectionImages/ICONS/24/list-icon.png';
                            ComponetsData['allComponets'][i].RightArrowIcon = IsUpdated != undefined && IsUpdated == 'Service' ? GlobalConstants.MAIN_SITE_URL + '/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png' : GlobalConstants.MAIN_SITE_URL + '/SP/SiteCollectionImages/ICONS/24/right-list-icon.png';
                            ComponetsData['allComponets'][i]['childs'].push(task);
                            if (ComponetsData['allComponets'][i].Id === 413)
                                console.log(ComponetsData['allComponets'][i]['childs'].length)
                        }
                        break;
                    }
                }
            });
        }
        if (IsUpdated === 'Events') {
            $.each(task['Events'], function (index: any, componentItem: any) {
                for (var i = 0; i < ComponetsData['allComponets'].length; i++) {
                    let crntItem = ComponetsData['allComponets'][i];
                    if (componentItem.Id == crntItem.Id) {
                        if (crntItem.PortfolioStructureID != undefined && crntItem.PortfolioStructureID != '') {
                            task.PortfolioStructureID = crntItem.PortfolioStructureID;
                            task.ShowTooltipSharewebId = crntItem.PortfolioStructureID + '-' + task.Shareweb_x0020_ID;
                        }
                        if (crntItem.Portfolio_x0020_Type == 'Events') {
                            task.isService = true;
                            task.Portfolio_x0020_Type = 'Events';
                        }
                        if (ComponetsData['allComponets'][i]['childs'] == undefined)
                            ComponetsData['allComponets'][i]['childs'] = [];
                        if (!isItemExistsNew(ComponetsData['allComponets'][i]['childs'], task))
                            ComponetsData['allComponets'][i]['childs'].push(task);
                        break;
                    }
                }
            });
        }
        if (IsUpdated === 'Component') {
            $.each(task['Component'], function (index: any, componentItem: any) {
                for (var i = 0; i < ComponetsData['allComponets'].length; i++) {
                    let crntItem = ComponetsData['allComponets'][i];
                    if (componentItem.Id == crntItem.Id) {
                        if (crntItem.PortfolioStructureID != undefined && crntItem.PortfolioStructureID != '') {
                            task.PortfolioStructureID = crntItem.PortfolioStructureID;
                            task.ShowTooltipSharewebId = crntItem.PortfolioStructureID + '-' + task.Shareweb_x0020_ID;
                        }
                        if (crntItem.Portfolio_x0020_Type == 'Component') {
                            task.isService = true;
                            task.Portfolio_x0020_Type = 'Component';
                        }
                        if (ComponetsData['allComponets'][i]['childs'] == undefined)
                            ComponetsData['allComponets'][i]['childs'] = [];
                        if (!isItemExistsNew(ComponetsData['allComponets'][i]['childs'], task))
                            ComponetsData['allComponets'][i]['childs'].push(task);
                        break;
                    }
                }
            });
        }
    }
    //var pageType = 'Service-Portfolio';

    const DynamicSort = function (items: any, column: any) {
        items.sort(function (a: any, b: any) {
            // return   a[column] - b[column];
            var aID = a[column];
            var bID = b[column];
            return (aID == bID) ? 0 : (aID > bID) ? 1 : -1;
        })
    }
    var ComponetsData: any = {};
    ComponetsData.allUntaggedTasks = []
    const bindData = function () {
        var RootComponentsData: any[] = [];
        var ComponentsData: any = [];
        var SubComponentsData: any = [];
        var FeatureData: any = [];

        $.each(ComponetsData['allComponets'], function (index: any, result: any) {
            // result.AllTeamMembers = result.AllTeamMembers != undefined ? result.AllTeamMembers : [];
            // result.TeamLeader = result.TeamLeader != undefined ? result.TeamLeader : []
            result.CreatedDateImg = []
            result.childsLength = 0;
            result.TitleNew = result.Title;
            result.DueDate = Moment(result.DueDate).format('DD/MM/YYYY')
            result.flag = true;
            if (result.DueDate == 'Invalid date' || '') {
                result.DueDate = result.DueDate.replaceAll("Invalid date", "")
            }
            result.PercentComplete = (result.PercentComplete * 100).toFixed(0);

            if (result.Short_x0020_Description_x0020_On != undefined) {
                result.Short_x0020_Description_x0020_On = result.Short_x0020_Description_x0020_On.replace(/(<([^>]+)>)/ig, '');
            }
            result['siteType'] = 'Master Tasks';
            result['SiteIcon'] = globalCommon.GetIconImageUrl(result.siteType, GlobalConstants.MAIN_SITE_URL + '/SP', undefined);
            // if (result.AssignedTo != undefined && result.AssignedTo.length > 0) {
            //     $.each(result.AssignedTo, function (index: any, Assig: any) {
            //         if (Assig.Id != undefined) {
            //             $.each(Response, function (index: any, users: any) {

            //                 if (Assig.Id != undefined && users.AssingedToUser != undefined && Assig.Id == users.AssingedToUser.Id) {
            //                     users.ItemCover = users.Item_x0020_Cover?.Url;
            //                     result.AllTeamMembers.push(users);
            //                 }

            //             })
            //         }
            //     })
            // }
            // if (result.Team_x0020_Members != undefined && result.Team_x0020_Members != undefined && result.Team_x0020_Members.length > 0) {
            //     $.each(result.Team_x0020_Members, function (index: any, Assig2: any) {
            //         if (Assig2.Id != undefined) {
            //             $.each(TaskUsers, function (index: any, users: any) {
            //                 if (Assig2.Id != undefined && users.AssingedToUser != undefined && Assig2.Id == users.AssingedToUser.Id) {
            //                     users.ItemCover = users.Item_x0020_Cover?.Url;
            //                     result.AllTeamMembers.push(users);
            //                 }

            //             })
            //         }
            //     })
            // }

            // if (result.Responsible_x0020_Team != undefined && result.Responsible_x0020_Team != undefined && result.Responsible_x0020_Team.length > 0) {
            //     map(result.Responsible_x0020_Team, (Assig1: any) => {
            //         if (Assig1.Id != undefined) {
            //             map(TaskUsers, (users: any) => {
            //                 if (Assig1.Id != undefined && users.AssingedToUser != undefined && Assig1.Id == users.AssingedToUser.Id) {
            //                     users.ItemCover = users.Item_x0020_Cover?.Url;
            //                     result.TeamLeader.push(users);
            //                 }

            //             })
            //         }
            //     })
            // }
            if (result.Author != undefined) {
                if (result.Author.Id != undefined) {
                    $.each(TaskUsers, function (index: any, users: any) {
                        if (result.Author.Id != undefined && users.AssingedToUser != undefined && result.Author.Id == users.AssingedToUser.Id) {
                            users.ItemCover = users.Item_x0020_Cover.Url;
                            result.CreatedDateImg.push(users);
                        }
                    })
                }
            }
            if (result.PortfolioStructureID != null && result.PortfolioStructureID != undefined) {
                result['Shareweb_x0020_ID'] = result.PortfolioStructureID;
            }
            else {
                result['Shareweb_x0020_ID'] = '';
            }
            if (result.ClientCategory != undefined && result.ClientCategory.length > 0) {
                $.each(result.Team_x0020_Members, function (index: any, catego: any) {
                    result.ClientCategory.push(catego);
                })
            }
            if (result.Item_x0020_Type == 'Root Component') {
                result['childs'] = result['childs'] != undefined ? result['childs'] : [];
                RootComponentsData.push(result);
            }
            if (result.Item_x0020_Type == 'Component') {
                result['childs'] = result['childs'] != undefined ? result['childs'] : [];
                result.SiteIcon = IsUpdated != undefined && IsUpdated == 'Service' ? GlobalConstants.MAIN_SITE_URL + '/SP/SiteCollectionImages/ICONS/Service_Icons/component_icon.png' : GlobalConstants.MAIN_SITE_URL + '/SP/SiteCollectionImages/ICONS/Shareweb/component_icon.png';
                ComponentsData.push(result);


            }

            if (result.Item_x0020_Type == 'SubComponent') {
                result.SiteIcon = IsUpdated != undefined && IsUpdated == 'Service' ? GlobalConstants.MAIN_SITE_URL + '/SP/SiteCollectionImages/ICONS/Service_Icons/SubComponent_icon.png' : GlobalConstants.MAIN_SITE_URL + '/SP/SiteCollectionImages/ICONS/Shareweb/SubComponent_icon.png'
                result['childs'] = result['childs'] != undefined ? result['childs'] : [];
                if (result['childs'].length > 0) {
                    result.downArrowIcon = IsUpdated != undefined && IsUpdated == 'Service' ? GlobalConstants.MAIN_SITE_URL + '/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png' : GlobalConstants.MAIN_SITE_URL + '/SP/SiteCollectionImages/ICONS/24/list-icon.png';
                    result.RightArrowIcon = IsUpdated != undefined && IsUpdated == 'Service' ? GlobalConstants.MAIN_SITE_URL + '/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png' : GlobalConstants.MAIN_SITE_URL + '/SP/SiteCollectionImages/ICONS/24/right-list-icon.png';
                }
                SubComponentsData.push(result);


            }
            if (result.Item_x0020_Type == 'Feature') {
                result.SiteIcon = IsUpdated != undefined && IsUpdated == 'Service' ? GlobalConstants.MAIN_SITE_URL + '/SP/SiteCollectionImages/ICONS/Service_Icons/feature_icon.png' : GlobalConstants.MAIN_SITE_URL + '/SP/SiteCollectionImages/ICONS/Shareweb/feature_icon.png';
                result['childs'] = result['childs'] != undefined ? result['childs'] : [];
                if (result['childs'].length > 0) {
                    result.downArrowIcon = IsUpdated != undefined && IsUpdated == 'Service' ? GlobalConstants.MAIN_SITE_URL + '/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png' : GlobalConstants.MAIN_SITE_URL + '/SP/SiteCollectionImages/ICONS/24/list-icon.png';
                    result.RightArrowIcon = IsUpdated != undefined && IsUpdated == 'Service' ? GlobalConstants.MAIN_SITE_URL + '/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png' : GlobalConstants.MAIN_SITE_URL + '/SP/SiteCollectionImages/ICONS/24/right-list-icon.png';
                    DynamicSort(result.childs, 'Shareweb_x0020_ID');
                    //if (result.childs != undefined && result.childs.length > 0)
                    result.childsLength = result.childs.length;
                }
                FeatureData.push(result);
            }
            // if (result.Title == 'Others') {
            //     //result['childs'] = result['childs'] != undefined ? result['childs'] : [];
            //     ComponentsData.push(result);
            // }
        });

        $.each(SubComponentsData, function (index: any, subcomp: any) {
            if (subcomp.Title != undefined) {
                if (subcomp['childs'] != undefined && subcomp['childs'].length > 0) {
                    let Tasks = subcomp['childs'].filter((sub: { Item_x0020_Type: string; }) => (sub.Item_x0020_Type === 'Task'));
                    let Features = subcomp['childs'].filter((sub: { Item_x0020_Type: string; }) => (sub.Item_x0020_Type === 'Feature'));
                    subcomp['childs'] = [];
                    DynamicSort(Tasks, 'Shareweb_x0020_ID');
                    subcomp['childs'] = Features.concat(Tasks);
                    subcomp.childsLength = Tasks.length;
                }
                $.each(FeatureData, function (index: any, featurecomp: any) {
                    if (featurecomp.Parent != undefined && subcomp.Id == featurecomp.Parent.Id) {
                        subcomp.downArrowIcon = IsUpdated != undefined && IsUpdated == 'Service' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/list-icon.png';
                        subcomp.RightArrowIcon = IsUpdated != undefined && IsUpdated == 'Service' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/right-list-icon.png';
                        subcomp.childsLength++;
                        if (featurecomp['childs'] != undefined && featurecomp['childs'].length > 0) {
                            let Tasks = featurecomp['childs'].filter((sub: { Item_x0020_Type: string; }) => (sub.Item_x0020_Type === 'Task'));
                            featurecomp['childs'] = [];
                            DynamicSort(Tasks, 'Shareweb_x0020_ID');
                            featurecomp['childs'] = Tasks;
                            featurecomp.childsLength = Tasks.length;
                        }
                        subcomp['childs'].unshift(featurecomp);;
                    }
                })

                DynamicSort(subcomp.childs, 'PortfolioLevel');
            }
        })
        if (ComponentsData != undefined && ComponentsData.length > 0) {
            $.each(ComponentsData, function (index: any, subcomp: any) {
                // if (subcomp['childs'] != undefined && subcomp['childs'].length > 0) {
                //     let Tasks = subcomp['childs'].filter((sub: { Item_x0020_Type: string; }) => (sub.Item_x0020_Type === 'Task'));
                //     let Features = subcomp['childs'].filter((sub: { Item_x0020_Type: string; }) => (sub.Item_x0020_Type === 'Feature'));
                //     subcomp['childs'] = [];
                //     DynamicSort(Tasks, 'Shareweb_x0020_ID');
                //     subcomp['childs'] = Features.concat(Tasks);
                // }
                if (subcomp.Title != undefined) {
                    $.each(SubComponentsData, function (index: any, featurecomp: any) {
                        if (featurecomp.Parent != undefined && subcomp.Id == featurecomp.Parent.Id) {
                            subcomp.downArrowIcon = IsUpdated != undefined && IsUpdated == 'Service' ? GlobalConstants.MAIN_SITE_URL + '/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png' : GlobalConstants.MAIN_SITE_URL + '/SP/SiteCollectionImages/ICONS/24/list-icon.png';
                            subcomp.RightArrowIcon = IsUpdated != undefined && IsUpdated == 'Service' ? GlobalConstants.MAIN_SITE_URL + '/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png' : GlobalConstants.MAIN_SITE_URL + '/SP/SiteCollectionImages/ICONS/24/right-list-icon.png';
                            subcomp.childsLength++;
                            subcomp['childs'].unshift(featurecomp);;
                        }
                    })
                    DynamicSort(subcomp.childs, 'PortfolioLevel');
                }
            })

            map(ComponentsData, (comp) => {
                if (comp.Title != undefined) {
                    map(FeatureData, (featurecomp) => {
                        if (featurecomp.Parent != undefined && comp.Id === featurecomp.Parent.Id) {
                            comp.downArrowIcon = IsUpdated != undefined && IsUpdated == 'Service' ? GlobalConstants.MAIN_SITE_URL + '/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png' : GlobalConstants.MAIN_SITE_URL + '/SP/SiteCollectionImages/ICONS/24/list-icon.png';
                            comp.RightArrowIcon = IsUpdated != undefined && IsUpdated == 'Service' ? GlobalConstants.MAIN_SITE_URL + '/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png' : GlobalConstants.MAIN_SITE_URL + '/SP/SiteCollectionImages/ICONS/24/right-list-icon.png';
                            comp.childsLength++;
                            comp['childs'].unshift(featurecomp);;
                        }
                    })
                }
            })
        } else
            ComponentsData = SubComponentsData.length === 0 ? FeatureData : SubComponentsData;
        var array: any = [];
        map(ComponentsData, (comp, index) => {
            if (comp.childs != undefined && comp.childs.length > 0) {
                var Subcomponnet = comp.childs.filter((sub: { Item_x0020_Type: string; }) => (sub.Item_x0020_Type === 'SubComponent'));
                DynamicSort(Subcomponnet, 'PortfolioLevel')
                var SubTasks = comp.childs.filter((sub: { Item_x0020_Type: string; }) => (sub.Item_x0020_Type === 'Task'));
                var SubFeatures = comp.childs.filter((sub: { Item_x0020_Type: string; }) => (sub.Item_x0020_Type === 'Feature'));
                DynamicSort(SubFeatures, 'PortfolioLevel')
                SubFeatures = SubFeatures.concat(SubTasks);
                Subcomponnet = Subcomponnet.concat(SubFeatures);
                comp['childs'] = Subcomponnet;
                array.push(comp)

                if (Subcomponnet != undefined && Subcomponnet.length > 0) {
                    //  if (comp.childs != undefined && comp.childs.length > 0) {
                    map(Subcomponnet, (subcomp, index) => {
                        if (subcomp.childs != undefined && subcomp.childs.length > 0) {
                            var Subchildcomponnet = subcomp.childs.filter((sub: any) => (sub.Item_x0020_Type === 'Feature'));
                            DynamicSort(SubFeatures, 'PortfolioLevel')
                            var SubchildTasks = subcomp.childs.filter((sub: any) => (sub.Item_x0020_Type === 'Task'));
                            Subchildcomponnet = Subchildcomponnet.concat(SubchildTasks);
                            subcomp['childs'] = Subchildcomponnet;
                            // var SubchildTasks = subcomp.childs.filter((sub: any) => (sub.ItemType === 'SubComponnet'));
                        }

                    })
                }
            } else array.push(comp)
        })
        ComponentsData = array;
        // var id = props.Id;
        // var arrys: any = [];
        // if (props.Item_x0020_Type == "Component") {
        //     $.each(ComponentsData, function (index: any, subcomp: any) {
        //         if (subcomp.Id == id)
        //             arrys.push(subcomp.childs)
        //         if (subcomp.childs != undefined && subcomp.childs.length > 0) {
        //             $.each(subcomp.childs, function (index: any, Nextcomp: any) {
        //                 if (Nextcomp.childs.Id == id)
        //                     arrys.push(Nextcomp.childs)
        //                 if (Nextcomp.childs != undefined && Nextcomp.childs.length > 0) {
        //                     $.each(Nextcomp.childs, function (index: any, Nextnextcomp: any) {
        //                         if (Nextnextcomp.Id == id)
        //                             arrys.push(Nextnextcomp.childs);
        //                     })
        //                 }
        //             })
        //         }
        //     })
        // }
        // if (props.Item_x0020_Type == "SubComponent") {
        //     $.each(SubComponentsData, function (index: any, subcomp: any) {
        //         if (subcomp.Id == id)
        //             arrys.push(subcomp.childs)
        //         if (subcomp.childs != undefined && subcomp.childs.length > 0) {
        //             $.each(subcomp.childs, function (index: any, Nextcomp: any) {
        //                 if (Nextcomp.childs.Id == id)
        //                     arrys.push(Nextcomp.childs)
        //                 if (Nextcomp.childs != undefined && Nextcomp.childs.length > 0) {
        //                     $.each(Nextcomp.childs, function (index: any, Nextnextcomp: any) {
        //                         if (Nextnextcomp.Id == id)
        //                             arrys.push(Nextnextcomp.childs);
        //                     })
        //                 }
        //             })
        //         }
        //     })
        // }
        // if (props.Item_x0020_Type == "Feature") {
        //     $.each(FeatureData, function (index: any, subcomp: any) {
        //         if (subcomp.Id == id)
        //             arrys.push(subcomp.childs)
        //         if (subcomp.childs != undefined && subcomp.childs.length > 0) {
        //             $.each(subcomp.childs, function (index: any, Nextcomp: any) {
        //                 if (Nextcomp.childs.Id == id)
        //                     arrys.push(Nextcomp.childs)
        //                 if (Nextcomp.childs != undefined && Nextcomp.childs.length > 0) {
        //                     $.each(Nextcomp.childs, function (index: any, Nextnextcomp: any) {
        //                         if (Nextnextcomp.Id == id)
        //                             arrys.push(Nextnextcomp.childs);
        //                     })
        //                 }
        //             })
        //         }
        //     })
        // }

        //maidataBackup.push(ComponentsData)
        var temp: any = {};
        temp.TitleNew = 'Tasks';
        temp.childs = [];
        //  temp.AllTeamMembers = [];
        //  temp.AllTeamMembers = [];
        temp.TeamLeader = [];
        temp.flag = true;
        temp.downArrowIcon = IsUpdated != undefined && IsUpdated == 'Service' ? GlobalConstants.MAIN_SITE_URL + '/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png' : GlobalConstants.MAIN_SITE_URL + '/SP/SiteCollectionImages/ICONS/24/list-icon.png';
        temp.RightArrowIcon = IsUpdated != undefined && IsUpdated == 'Service' ? GlobalConstants.MAIN_SITE_URL + '/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png' : GlobalConstants.MAIN_SITE_URL + '/SP/SiteCollectionImages/ICONS/24/right-list-icon.png';

        temp.show = true;
        ComponentsData.push(temp);
        temp.childs = ComponentsData[0].childs.filter((sub: any) => (sub.Item_x0020_Type === 'Task' && sub.childs.length == 0));
        AllItems = ComponentsData[0].childs.filter((sub: any) => (sub.Item_x0020_Type != 'Task' || sub.childs.length > 0));
        var activities = temp.childs.filter((sub: any) => (sub?.SharewebTaskType?.Title === 'Activities'));
        if (activities != undefined && activities.length > 0) {
            AllItems = AllItems.concat(activities);
        }
        temp.childs = temp.childs.filter((sub: any) => (sub?.SharewebTaskType?.Title != 'Activities'));
        temp.childsLength = temp.childs.length;

        if (temp.childs != undefined && temp.childs.length > 0)
            AllItems.push(temp);
        setSubComponentsData(SubComponentsData); setFeatureData(FeatureData);
        setComponentsData(ComponentsData);
        setmaidataBackup(AllItems)
        setData(AllItems);
        showProgressHide();
    }

    var makeFinalgrouping = function () {
        var AllTaskData1: any = [];
        ComponetsData['allUntaggedTasks'] = [];
        AllTaskData1 = AllTaskData1.concat(TasksItem);
        $.each(AllTaskData1, function (index: any, task: any) {
            if (task.Id === 3559 || task.Id === 3677)
                console.log(task);
            task.Portfolio_x0020_Type = 'Component';
            if (IsUpdated === 'Service') {
                if (task['Services'] != undefined && task['Services'].length > 0) {
                    task.Portfolio_x0020_Type = 'Service';
                    findTaggedComponents(task);
                }

            }
            if (IsUpdated === 'Events') {
                if (task['Events'] != undefined && task['Events'].length > 0) {
                    task.Portfolio_x0020_Type = 'Events';
                    findTaggedComponents(task);
                }

            }
            if (IsUpdated === 'Component') {
                if (task['Component'] != undefined && task['Component'].length > 0) {
                    task.Portfolio_x0020_Type = 'Component';
                    findTaggedComponents(task);
                }

            }
        })
        var temp: any = {};
        temp.TitleNew = 'Tasks';
        temp.childs = [];
        temp.flag = true;
        ComponetsData['allComponets'].push(temp);
        bindData();
    }
    // const filterDataBasedOnList = function () {
    //     var AllTaskData1: any = [];
    //     AllTaskData1 = AllTaskData1.concat(CopyTaskData);
    //     makeFinalgrouping();
    // }
    var TasksItem: any = [];

    function Buttonclick(e: any) {
        e.preventDefault();
        this.setState({ callchildcomponent: true });

    }
    const setModalIsOpenToFalse = () => {
        setModalIsOpen(false)
    }

    const closeModal = () => {
        setAddModalOpen(false)
    }


    const Prints = () => {
        window.print();
    }
    // ---------------------Export to Excel-------------------------------------------------------------------------------------

    const getCsvData = () => {
        const csvData = [['Title']];
        let i;
        for (i = 0; i < data.length; i += 1) {
            csvData.push([`${data[i].Title}`]);
        }
        return csvData;
    };
    const clearSearch = () => {
        setSearch('')

    }


    // Expand Table 
    const expndpopup = (e: any) => {

        settablecontiner(e);
    };


    //------------------Edit Data----------------------------------------------------------------------------------------------------------------------------

    // const  Handler = (itrm: any) => {
    //     const list = [...checkedList];
    //     var flag = true;
    //     list.forEach((obj: any, index: any) => {
    //         if (obj.Id != undefined && itrm?.Id != undefined && obj.Id === itrm.Id) {
    //             flag = false;
    //             list.splice(index, 1);
    //         }
    //     })
    //     if (flag)
    //         list.push(itrm);

    //     console.log(list);
    //     setCheckedList(checkedList => ([...list]));
    // };



    const onChangeHandler = (itrm: any, child: any, e: any) => {
        var Arrays: any = []


        const { checked } = e.target;
        if (checked == true) {
            itrm.chekBox = true;
            if (itrm.ClientCategory != undefined && itrm.ClientCategory.length > 0) {
                itrm.ClientCategory.map((clientcategory: any) => {
                    selectedCategory.push(clientcategory)
                })


            }

            if (itrm.SharewebTaskType == undefined) {
                setActivityDisable(false)
                itrm['siteUrl'] = 'https://hhhhteams.sharepoint.com/sites/HHHH/SP';
                itrm['listName'] = 'Master Tasks';
                MeetingItems.push(itrm)
                //setMeetingItems(itrm);

            }
            if (itrm.SharewebTaskType != undefined) {
                if (itrm.SharewebTaskType.Title == 'Activities' || itrm.SharewebTaskType.Title == "Workstream") {
                    setActivityDisable(false)
                    // itrm['siteUrl'] = 'https://hhhhteams.sharepoint.com/sites/HHHH/SP';
                    // itrm['listName'] = 'Master Tasks';
                    Arrays.push(itrm)
                    itrm['PortfolioId'] = child.Id;
                    childsData.push(itrm)
                }
            }
            if (itrm.SharewebTaskType != undefined) {
                if (itrm.SharewebTaskType.Title == 'Task') {
                    setActivityDisable(true)

                }
            }
        }
        if (checked == false) {
            itrm.chekBox = false;
            MeetingItems?.forEach((val: any, index: any) => {
                if (val.Id == itrm.Id) {
                    MeetingItems.splice(index, 1)
                }
            })
            if (itrm.SharewebTaskType != undefined) {
                if (itrm.SharewebTaskType.Title == 'Task') {
                    setActivityDisable(false)

                }
            }
        }

        const list = [...checkedList];
        var flag = true;
        list.forEach((obj: any, index: any) => {
            if (obj.Id != undefined && itrm?.Id != undefined && obj.Id === itrm.Id) {
                flag = false;
                list.splice(index, 1);
            }
        })
        if (flag)
            list.push(itrm);
        maidataBackup.forEach((obj, index) => {
            obj.isRestructureActive = false;
            if (obj.childs != undefined && obj.childs.length > 0) {
                obj.childs.forEach((sub: any, indexsub: any) => {
                    sub.isRestructureActive = false;
                    if (sub.childs != undefined && sub.childs.length > 0) {
                        sub.childs.forEach((newsub: any, lastIndex: any) => {
                            newsub.isRestructureActive = false;

                        })
                    }

                })
            }

        })
        setData(data => ([...maidataBackup]));
        setCheckedList(checkedList => ([...list]));
    };
    var TaskTimeSheetCategoriesGrouping: any = [];
    var TaskTimeSheetCategories: any = [];
    var AllTimeSpentDetails: any = [];
    const isItemExists = function (arr: any, Id: any) {
        var isExists = false;
        $.each(arr, function (index: any, item: any) {
            if (item.Id == Id) {
                isExists = true;
                return false;
            }
        });
        return isExists;
    }
    const checkCategory = function (item: any, category: any) {
        $.each(TaskTimeSheetCategoriesGrouping, function (index: any, categoryTitle: any) {
            if (categoryTitle.Id == category) {
                // item.isShow = true;
                if (categoryTitle.Childs.length == 0) {
                    categoryTitle.Childs = [];
                }
                if (!isItemExists(categoryTitle.Childs, item.Id)) {
                    item.show = true;
                    categoryTitle.Childs.push(item);
                }
            }
        })
    }

    const EditData = (e: any, item: any) => {
        setIsTimeEntry(true);
        setSharewebTimeComponent(item);
    }

    const handleTitle = (e: any) => {
        setTitle(e.target.value)

    };

    const EditComponentPopup = (item: any) => {
        // <ComponentPortPolioPopup ></ComponentPortPolioPopup>
        setIsComponent(true);
        setSharewebComponent(item);
        // <ComponentPortPolioPopup props={item}></ComponentPortPolioPopup>
    }
    const EditItemTaskPopup = (item: any) => {
        // <ComponentPortPolioPopup ></ComponentPortPolioPopup>
        setIsTask(true);
        setSharewebTask(item);
        // <ComponentPortPolioPopup props={item}></ComponentPortPolioPopup>
    }
    function AddItem() {
    }



    const Call = React.useCallback((childItem: any) => {
        MeetingItems?.forEach((val: any): any => {
            val.chekBox = false;
        })
        closeTaskStatusUpdatePoup2();
        setIsComponent(false);;
        setIsTask(false);
        setMeetingPopup(false);
        setWSPopup(false);
        var MainId: any = ''
        if (childItem != undefined) {
            childItem.data['flag'] = true;
            childItem.data['TitleNew'] = childItem.data.Title;
            childItem.data['SharewebTaskType'] = { Title: 'Activities' }
            if (childItem.data.ServicesId != undefined && childItem.data.ServicesId.length > 0) {
                MainId = childItem.data.ServicesId[0]
            }
            if (childItem.data.ComponentId != undefined && childItem.data.ComponentId.length > 0) {
                MainId = childItem.data.ComponentId[0]
            }

            if (AllItems != undefined) {
                AllItems.forEach((val: any) => {
                    val.flag = true;
                    val.show = false;
                    if (val.Id == MainId) {
                        val.childs.push(childItem.data)
                    }

                })
                setData(AllItems => ([...AllItems]))

            }

        }



    }, []);
    const TimeEntryCallBack = React.useCallback((item1) => {
        setIsTimeEntry(false);
    }, []);
    let isOpenPopup = false;
    const onPopUpdata = function (item: any) {
        isOpenPopup = true;
        item.data.childs = [];
        item.data.flag = true;
        item.data.siteType = "Master Tasks"
        item.data.TitleNew = item.data.Title;
        item.data.childsLength = 0;
        item.data['Shareweb_x0020_ID'] = item.data.PortfolioStructureID;
        if (checkedList != undefined && checkedList.length > 0)
            checkedList[0].childs.unshift(item.data);
        else AllItems.unshift(item.data);

        setSharewebComponent(item.data)
        setIsComponent(true);
        setData((data) => [...AllItems]);
    }
    const CloseCall = React.useCallback((item) => {
        if (item.CreateOpenType === "CreatePopup") {
            onPopUpdata(item.CreatedItem[0]);
        }
        else if (!isOpenPopup && item.CreatedItem != undefined) {
            item.CreatedItem.forEach((obj: any) => {
                obj.data.childs = [];
                obj.data.flag = true;
                obj.data.TitleNew = obj.data.Title;
                // obj.data.Team_x0020_Members=item.TeamMembersIds;
                // obj.AssignedTo =item.AssignedIds;
                obj.data.siteType = "Master Tasks";
                obj.data['Shareweb_x0020_ID'] = obj.data.PortfolioStructureID;
                if (item.props != undefined && item.props.SelectedItem != undefined) {
                    item.props.SelectedItem.childs = item.props.SelectedItem.childs == undefined ? [] : item.props.SelectedItem.childs;
                    if (item.props.SelectedItem.childs.length === 0) {
                        item.props.SelectedItem.downArrowIcon = IsUpdated != undefined && IsUpdated == 'Service' ? GlobalConstants.MAIN_SITE_URL + '/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png' : GlobalConstants.MAIN_SITE_URL + '/SP/SiteCollectionImages/ICONS/24/list-icon.png';
                        item.props.SelectedItem.RightArrowIcon = IsUpdated != undefined && IsUpdated == 'Service' ? GlobalConstants.MAIN_SITE_URL + '/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png' : GlobalConstants.MAIN_SITE_URL + '/SP/SiteCollectionImages/ICONS/24/right-list-icon.png';
                    }
                    item.props.SelectedItem.childs.unshift(obj.data);
                }


            })
            if (AllItems != undefined && AllItems.length > 0) {
                AllItems.forEach((comp: any, index: any) => {
                    if (comp.Id != undefined && item.props.SelectedItem != undefined && comp.Id === item.props.SelectedItem.Id) {

                        comp.childsLength = item.props.SelectedItem.childs.length;
                        comp.show = comp.show == undefined ? false : comp.show
                        if (comp.childs.length === 0) {
                            comp.downArrowIcon = item.props.SelectedItem.downArrowIcon;
                            comp.RightArrowIcon = item.props.SelectedItem.RightArrowIcon;
                        }
                        comp.childs = item.props.SelectedItem.childs;
                    }
                    if (comp.childs != undefined && comp.childs.length > 0) {
                        comp.childs.forEach((subcomp: any, index: any) => {
                            if (subcomp.Id != undefined && item.props.SelectedItem != undefined && subcomp.Id === item.props.SelectedItem.Id) {

                                subcomp.childsLength = item.props.SelectedItem.childs.length;
                                subcomp.show = subcomp.show == undefined ? false : subcomp.show
                                if (comp.childs.length === 0) {
                                    subcomp.downArrowIcon = item.props.SelectedItem.downArrowIcon;
                                    subcomp.RightArrowIcon = item.props.SelectedItem.RightArrowIcon;
                                }
                                subcomp.childs = item.props.SelectedItem.childs;
                            }
                        })
                    }

                })
                // }
            }
            setData((data) => [...AllItems]);
        }
        if (!isOpenPopup && item.data != undefined) {
            item.data.childs = [];
            item.data.flag = true;
            item.data.TitleNew = item.data.Title;
            item.data.siteType = "Master Tasks"
            item.data.childsLength = 0;
            item.data['Shareweb_x0020_ID'] = item.data.PortfolioStructureID;
            AllItems.unshift(item.data);
            setData((data) => [...AllItems]);
        }
        setAddModalOpen(false)
    }, []);

    const CreateOpenCall = React.useCallback((item) => {

        // setSharewebComponent(item);
    }, []);

    var myarray: any = [];
    var myarray1: any = [];
    var myarray2: any = [];
    if (props.Sitestagging != null) {
        myarray.push(JSON.parse(props.Sitestagging));
    }
    if (myarray.length != 0) {
        myarray[0].map((items: any) => {
            if (items.SiteImages != undefined && items.SiteImages != '') {
                items.SiteImages = items.SiteImages.replace('https://www.hochhuth-consulting.de', GlobalConstants.MAIN_SITE_URL)
                myarray1.push(items)
            }
            // console.log(myarray1);
            // if (items.ClienTimeDescription != undefined) {
            //     items.ClienTimeDescription = parseFloat(item.ClienTimeDescription);
            //     myarray1.push(items)
            // }
        })
        if (props.ClientCategory.results.length != 0) {
            props.ClientCategory.results.map((terms: any) => {
                //     if(myarray2.length!=0 && myarray2[0].title==terms.title){
                //                ""
                //     }else{
                //    myarray2.push(terms);
                // }
                myarray2.push(terms);
            })
        }
        //    const letters = new Set([myarray2]);
        // console.log(myarray2)
        // myarray.push();
    }
    const [lgShow, setLgShow] = React.useState(false);
    function handleClose() {
        selectedCategory = [];
        setLgShow(false);
    }
    const [lgNextShow, setLgNextShow] = React.useState(false);
    const handleCloseNext = () => setLgNextShow(false);
    const [CreateacShow, setCreateacShow] = React.useState(false);
    const handleCreateac = () => setCreateacShow(false);

    const handleSuffixHover = (item: any) => {
        item.Display = 'block'
        setData(data => ([...data]));
    }

    const handleuffixLeave = (item: any) => {
        item.Display = 'none'
        setData(data => ([...data]));
    }
    // Add activity popup array
    const closeTaskStatusUpdatePoup2 = () => {
        MeetingItems?.forEach((val: any): any => {
            val.chekBox = false;
        })
        setActivityPopup(false)
        // childsData =[]
        MeetingItems = []
        childsData = []
        // setMeetingItems([])


    }
    const CreateMeetingPopups = (item: any) => {
        setMeetingPopup(true);
        MeetingItems[0]['NoteCall'] = item;


    }
    const openActivity = () => {
        if (MeetingItems.length == 0 && childsData.length == 0) {
            MeetingItems.push(props)
        }
        if (MeetingItems.length > 1) {
            alert('More than 1 Parents selected, Select only 1 Parent to create a child item')
        }
        else {

            if (MeetingItems[0] != undefined) {
                if (items != undefined && items.length > 0) {
                    MeetingItems[0].ClientCategory = []
                    items.forEach((val: any) => {
                        MeetingItems[0].ClientCategory.push(val)
                    })
                }
                if (MeetingItems[0].SharewebTaskType != undefined) {
                    if (MeetingItems[0].SharewebTaskType.Title == 'Activities') {
                        setWSPopup(true)
                    }
                }

                if (MeetingItems != undefined && MeetingItems[0].SharewebTaskType?.Title == 'Workstream') {
                    setActivityPopup(true)

                }
                // if(MeetingItems[0].Portfolio_x0020_Type == 'Service'&& MeetingItems[0].SharewebTaskType == undefined && childsData[0] == undefined){
                //     MeetingItems[0]['NoteCall'] = 'Activities';
                //     setMeetingPopup(true)
                // }
                if (MeetingItems[0].SharewebTaskType == undefined && childsData[0] == undefined) {
                    setActivityPopup(true)
                }
            }

        }

        if (childsData[0] != undefined && childsData[0].SharewebTaskType != undefined) {
            if (childsData[0].SharewebTaskType.Title == 'Activities') {
                setWSPopup(true)
                MeetingItems.push(childsData[0])
                //setMeetingItems(childsData)
            }
            if (childsData[0] != undefined && childsData[0].SharewebTaskType.Title == 'Workstream') {
                //setActivityPopup(true)
                childsData[0].NoteCall = 'Task'
                setMeetingPopup(true)
                MeetingItems.push(childsData[0])
            }
        }







    }
    const buttonRestructuring = () => {
        var ArrayTest: any = [];
        //  if (checkedList != undefined && checkedList.length === 1) {
        if (checkedList.length > 0 && checkedList[0].childs != undefined && checkedList[0].childs.length > 0 && checkedList[0].Item_x0020_Type === 'Component')
            alert('You are not allowed to Restructure this item.')
        if (checkedList.length > 0 && checkedList[0].childs != undefined && checkedList[0].childs.length === 0 && checkedList[0].Item_x0020_Type === 'Component') {

            maidataBackup.forEach((obj) => {
                obj.isRestructureActive = true;
                if (obj.Id === checkedList[0].Id)
                    obj.isRestructureActive = false;
                ArrayTest.push(...[obj])
                if (obj.childs != undefined && obj.childs.length > 0) {
                    obj.childs.forEach((sub: any) => {
                        if (sub.Item_x0020_Type === 'SubComponent') {
                            sub.isRestructureActive = true;
                            // ArrayTest.push(sub)
                        }

                    })
                }
            })
        }
        if (checkedList.length > 0 && checkedList[0].Item_x0020_Type === 'SubComponent') {
            maidataBackup.forEach((obj) => {
                obj.isRestructureActive = true;
                if (obj.childs != undefined && obj.childs.length > 0) {
                    obj.childs.forEach((sub: any) => {
                        if (sub.Id === checkedList[0].Id) {
                            ArrayTest.push(...[obj])
                            ArrayTest.push(...[sub])
                            // ArrayTest.push(sub)
                        }

                    })
                }


            })
        }
        if (checkedList.length > 0 && checkedList[0].Item_x0020_Type === 'Feature') {
            maidataBackup.forEach((obj) => {
                obj.isRestructureActive = true;
                if (obj.childs != undefined && obj.childs.length > 0) {
                    obj.childs.forEach((sub: any) => {
                        sub.isRestructureActive = true;
                        if (sub.Id === checkedList[0].Id) {
                            ArrayTest.push(...[obj]);
                            ArrayTest.push(...[sub]);
                        }
                        if (sub.childs != undefined && sub.childs.length > 0) {
                            sub.childs.forEach((newsub: any) => {
                                if (newsub.Id === checkedList[0].Id) {
                                    ArrayTest.push(...[obj]);
                                    ArrayTest.push(...[sub]);
                                    ArrayTest.push(...[newsub]);
                                }


                            })
                        }

                    })
                }

            })
        }
        else if (checkedList.length > 0 && checkedList[0].Item_x0020_Type === 'Task') {
            maidataBackup.forEach((obj) => {
                obj.isRestructureActive = true;
                if (obj.Id === checkedList[0].Id) {
                    ArrayTest.push(...[obj])
                }
                if (obj.childs != undefined && obj.childs.length > 0) {
                    obj.childs.forEach((sub: any) => {
                        if (sub.Item_x0020_Type === 'SubComponent')
                            sub.isRestructureActive = true;
                        if (sub.Id === checkedList[0].Id) {
                            ArrayTest.push(...[obj])
                            ArrayTest.push(...[sub])
                            // ArrayTest.push(sub)
                        }
                        if (sub.childs != undefined && sub.childs.length > 0) {
                            sub.childs.forEach((subchild: any) => {
                                if (subchild.Item_x0020_Type === 'SubComponent')
                                    subchild.isRestructureActive = true;
                                if (subchild.Id === checkedList[0].Id) {
                                    ArrayTest.push(...[obj])
                                    ArrayTest.push(...[sub])
                                    ArrayTest.push(...[subchild])
                                    // ArrayTest.push(sub)
                                }
                                if (subchild.childs != undefined && subchild.childs.length > 0) {
                                    subchild.childs.forEach((listsubchild: any) => {
                                        if (listsubchild.Id === checkedList[0].Id) {
                                            ArrayTest.push(...[obj])
                                            ArrayTest.push(...[sub])
                                            ArrayTest.push(...[subchild])
                                            ArrayTest.push(...[listsubchild])
                                        }

                                    })
                                }

                            })
                        }

                    })
                }


            })
        }
        setOldArrayBackup(ArrayTest)
        setData((data) => [...maidataBackup]);

        //  }
        // setAddModalOpen(true)
    }



    var SomeMetaData1 = [{ "__metadata": { "id": "Web/Lists(guid'5ea288be-344d-4c69-9fb3-5d01b23dda25')/Items(11)", "uri": "https://hhhhteams.sharepoint.com/sites/HHHH/_api/;Web/Lists(guid'5ea288be-344d-4c69-9fb3-5d01b23dda25')/Items(11)", "etag": "\"13\"", "type": "SP.Data.SmartMetadataListItem" }, "Id": 15, "Title": "MileStone", "siteName": null, "siteUrl": null, "listId": null, "Description1": null, "IsVisible": true, "SmartFilters": { "__metadata": { "type": "Collection(Edm.String)" }, "results": [] }, "SortOrder": 2, "TaxType": "Categories", "Selectable": true, "ParentID": 24, "SmartSuggestions": null, "ID": 15 }, { "__metadata": { "id": "Web/Lists(guid'5ea288be-344d-4c69-9fb3-5d01b23dda25')/Items(105)", "uri": "https://hhhhteams.sharepoint.com/sites/HHHH/_api/Web/Lists(guid'5ea288be-344d-4c69-9fb3-5d01b23dda25')/Items(105)", "etag": "\"4\"", "type": "SP.Data.SmartMetadataListItem" }, "Id": 105, "Title": "Development", "siteName": null, "siteUrl": null, "listId": null, "Description1": null, "IsVisible": true, "Item_x005F_x0020_Cover": { "__metadata": { "type": "SP.FieldUrlValue" }, "Description": "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/development.png", "Url": "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/development.png" }, "SmartFilters": null, "SortOrder": 3, "TaxType": "Category", "Selectable": true, "ParentID": 0, "SmartSuggestions": null, "ID": 105 }, { "__metadata": { "id": "Web/Lists(guid'5ea288be-344d-4c69-9fb3-5d01b23dda25')/Items(282)", "uri": "https://hhhhteams.sharepoint.com/sites/HHHH/_api/Web/Lists(guid'5ea288be-344d-4c69-9fb3-5d01b23dda25')/Items(282)", "etag": "\"1\"", "type": "SP.Data.SmartMetadataListItem" }, "Id": 282, "Title": "Implementation", "siteName": null, "siteUrl": null, "listId": null, "Description1": "This should be tagged if a task is for applying an already developed component/subcomponent/feature.", "IsVisible": true, "Item_x005F_x0020_Cover": { "__metadata": { "type": "SP.FieldUrlValue" }, "Description": "/SiteCollectionImages/ICONS/Shareweb/Implementation.png", "Url": "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/Implementation.png" }, "SmartFilters": null, "SortOrder": 4, "TaxType": "Categories", "Selectable": true, "ParentID": 24, "SmartSuggestions": false, "ID": 282 }, { "__metadata": { "id": "Web/Lists(guid'5ea288be-344d-4c69-9fb3-5d01b23dda25')/Items(11)", "uri": "https://hhhhteams.sharepoint.com/sites/HHHH/_api/;Web/Lists(guid'5ea288be-344d-4c69-9fb3-5d01b23dda25')/Items(11)", "etag": "\"13\"", "type": "SP.Data.SmartMetadataListItem" }, "Id": 11, "Title": "Bug", "siteName": null, "siteUrl": null, "listId": null, "Description1": null, "IsVisible": true, "Item_x005F_x0020_Cover": { "__metadata": { "type": "SP.FieldUrlValue" }, "Description": "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/bug.png", "Url": "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/bug.png" }, "SmartFilters": { "__metadata": { "type": "Collection(Edm.String)" }, "results": ["MetaSearch", "Dashboard"] }, "SortOrder": 2, "TaxType": "Categories", "Selectable": true, "ParentID": 24, "SmartSuggestions": null, "ID": 11 }, { "__metadata": { "id": "Web/Lists(guid'5ea288be-344d-4c69-9fb3-5d01b23dda25')/Items(96)", "uri": "https://hhhhteams.sharepoint.com/sites/HHHH/_api/Web/Lists(guid'5ea288be-344d-4c69-9fb3-5d01b23dda25')/Items(96)", "etag": "\"5\"", "type": "SP.Data.SmartMetadataListItem" }, "Id": 96, "Title": "Feedback", "siteName": null, "siteUrl": null, "listId": null, "Description1": null, "IsVisible": true, "Item_x005F_x0020_Cover": { "__metadata": { "type": "SP.FieldUrlValue" }, "Description": "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/feedbck.png", "Url": "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/feedbck.png" }, "SmartFilters": null, "SortOrder": 2, "TaxType": null, "Selectable": true, "ParentID": 0, "SmartSuggestions": false, "ID": 96 }, { "__metadata": { "id": "Web/Lists(guid'5ea288be-344d-4c69-9fb3-5d01b23dda25')/Items(191)", "uri": "https://hhhhteams.sharepoint.com/sites/HHHH/_api/Web/Lists(guid'5ea288be-344d-4c69-9fb3-5d01b23dda25')/Items(191)", "etag": "\"3\"", "type": "SP.Data.SmartMetadataListItem" }, "Id": 191, "Title": "Improvement", "siteName": null, "siteUrl": null, "listId": null, "Description1": "Use this task category for any improvements of EXISTING features", "IsVisible": true, "Item_x005F_x0020_Cover": { "__metadata": { "type": "SP.FieldUrlValue" }, "Description": "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/Impovement.png", "Url": "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/Impovement.png" }, "SmartFilters": null, "SortOrder": 12, "TaxType": "Categories", "Selectable": true, "ParentID": 24, "SmartSuggestions": false, "ID": 191 }, { "__metadata": { "id": "Web/Lists(guid'5ea288be-344d-4c69-9fb3-5d01b23dda25')/Items(12)", "uri": "https://hhhhteams.sharepoint.com/sites/HHHH/_api/Web/Lists(guid'5ea288be-344d-4c69-9fb3-5d01b23dda25')/Items(12)", "etag": "\"13\"", "type": "SP.Data.SmartMetadataListItem" }, "Id": 12, "Title": "Design", "siteName": null, "siteUrl": null, "listId": null, "Description1": null, "IsVisible": true, "Item_x005F_x0020_Cover": { "__metadata": { "type": "SP.FieldUrlValue" }, "Description": "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/design.png", "Url": "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/design.png" }, "SmartFilters": { "__metadata": { "type": "Collection(Edm.String)" }, "results": ["MetaSearch", "Dashboard"] }, "SortOrder": 4, "TaxType": "Categories", "Selectable": true, "ParentID": 165, "SmartSuggestions": null, "ID": 12 }, { "__metadata": { "id": "Web/Lists(guid'5ea288be-344d-4c69-9fb3-5d01b23dda25')/Items(100)", "uri": "https://hhhhteams.sharepoint.com/sites/HHHH/_api/Web/Lists(guid'5ea288be-344d-4c69-9fb3-5d01b23dda25')/Items(100)", "etag": "\"13\"", "type": "SP.Data.SmartMetadataListItem" }, "Id": 100, "Title": "Activity", "siteName": null, "siteUrl": null, "listId": null, "Description1": null, "IsVisible": true, "Item_x005F_x0020_Cover": null, "SmartFilters": null, "SortOrder": 4, "TaxType": null, "Selectable": true, "ParentID": null, "SmartSuggestions": null, "ID": 100 }, { "__metadata": { "id": "Web/Lists(guid'5ea288be-344d-4c69-9fb3-5d01b23dda25')/Items(281)", "uri": "https://hhhhteams.sharepoint.com/sites/HHHH/_api/Web/Lists;(guid'5ea288be-344d-4c69-9fb3-5d01b23dda25')/Items(281)", "etag": "\"13\"", "type": "SP.Data.SmartMetadataListItem" }, "Id": 281, "Title": "Task", "siteName": null, "siteUrl": null, "listId": null, "Description1": null, "IsVisible": true, "Item_x005F_x0020_Cover": null, "SmartFilters": null, "SortOrder": 4, "TaxType": null, "Selectable": true, "ParentID": null, "SmartSuggestions": null, "ID": 281 }] as unknown as { siteName: any, siteUrl: any, listId: any, Description1: any, results: any[], SmartSuggestions: any, SmartFilters: any }[];
    console.log(siteConfig)



    const findUserByName = (name: any) => {
        const user = AllUsers.filter((user: any) => user.Title === name);
        let Image: any;
        if (user[0]?.Item_x0020_Cover != undefined) {
            Image = user[0].Item_x0020_Cover.Url
        } else {
            Image = "https://hhhhteams.sharepoint.com/sites/HHHH/PublishingImages/Portraits/icon_user.jpg"
        }
        return user ? Image : null;
    };
    return (
        <div className={IsUpdated == 'Events' ? 'app component eventpannelorange' : (IsUpdated == 'Service' ? 'app component serviepannelgreena' : 'app component')}>
            {/* Add activity task */}
            <Modal
                show={lgShow}
                aria-labelledby="example-modal-sizes-title-lg">
                <Modal.Header>
                    <Modal.Title>
                        <h6>Select Client Category</h6>
                    </Modal.Title>
                    <button type="button" className='Close-button' onClick={handleClose}>X</button>
                </Modal.Header>
                <Modal.Body className='p-2'>
                    <span className="bold">
                        <b>Please select any one Client Category.</b>
                    </span>
                    <div>
                        {selectedCategory.map((item: any) => {
                            return (
                                <li onClick={() => handleClick(item)}>{item.Title}</li>

                            )
                        })}
                    </div>
                </Modal.Body >
                <Modal.Footer>
                    <Button variant="primary" onClick={() => openActivity()}>
                        Ok
                    </Button>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* End of Add activity task */}
            {/* After Add activity task */}
            <Modal
                show={lgNextShow}
                aria-labelledby="example-modal-sizes-title-lg">
                <Modal.Header>
                    <Modal.Title>
                        <h6>Create Task</h6>
                    </Modal.Title>
                    <button type="button" className='Close-button' onClick={handleCloseNext}></button>
                </Modal.Header>
                <Modal.Body className='p-2'>
                    <span className="bold">
                        Clear Selection
                    </span>
                    <div>
                        {SomeMetaData1.map((item: any) => {
                            return (
                                <span>
                                    {item.Item_x005F_x0020_Cover != null &&
                                        <img src={item.Item_x005F_x0020_Cover.Url} />
                                    }
                                    <p onClick={() => setCreateacShow(true)}>{item.Title}</p>
                                </span>
                            )
                        })}
                    </div>
                </Modal.Body >
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseNext}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* After Add activity task End */}
            {/* Create task activity popup  */}
            <Modal
                show={CreateacShow}
                aria-labelledby="example-modal-sizes-title-lg">
                <Modal.Header>
                    <Modal.Title>
                        <h6>Create Quick Option</h6>
                    </Modal.Title>
                    <button type="button" className='Close-button' onClick={handleCreateac}></button>
                </Modal.Header>
                <Modal.Body className='p-2'>
                    <span className="bold">
                        Clear Selection
                    </span>
                    <div>
                        {siteConfig != null &&
                            <>
                                {siteConfig.map((site: any) => {
                                    return (
                                        <span>
                                            {(site.Title != undefined && site.Title != 'Foundation' && site.Title != 'Master Tasks' && site.Title != 'Gender' && site.Title != 'Health' && site.Title != 'SDC Sites' && site.Title != 'Offshore Tasks') &&
                                                <>
                                                    <img src={site.Item_x005F_x0020_Cover.Url} />
                                                    <p>{site.Title}</p>
                                                </>
                                            }
                                        </span>
                                    )
                                })}
                            </>
                        }
                    </div>
                </Modal.Body >
                <Modal.Footer>
                    <Button variant="primary"  >
                        Ok
                    </Button>
                    <Button variant="secondary" onClick={handleCreateac}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* End Create task activity popup  */}
            {/* Smart Time Popup */}
            {/* <Modal
                isOpen={SmartmodalIsOpen}
                onDismiss={setModalSmartIsOpenToFalse}
                isBlocking={true}
                isModeless={true}
            >
                <span >
                    <div id="myDropdown1" className="col-sm-12 pad0 dropdown-content">
                        <h4 className="col-sm-12 siteColor quickheader">
                            Smart Time <span title="Close popup" className="pull-right hreflink"
                                onClick={setModalSmartIsOpenToFalse}>
                                <i className="fa fa-times-circle"  ><FaRegTimesCircle /></i>
                            </span>
                        </h4>
                        <div className="col-md-12 mb-10 mt-10">
                            <select className="form-control"
                          >
                                <option value="">Select</option>
                                <option value="Equal to">Equal to</option>
                                <option value="Greater than">Greater than</option>
                                <option value="Less than">Less than</option>
                                <option value="Not equal to">Not equal to</option>
                            </select>
                        </div>
                        <div className="col-md-12 mb-10 mt-10">
                            <input type="text" placeholder="Effort"  className="form-control full-width ng-pristine ng-untouched ng-valid ng-empty" id="txtSmartTime" />
                        </div>
                        <div className="col-md-12 padL-0 text-center PadR0 mb-10 mt-10">
                            <button type="button" 
                                className="btn btn-primary">
                                Apply
                            </button>
                            <button type="button" className="btn btn-default blocks"
                               >
                                Clear
                            </button>
                        </div>
                    </div>
                </span>
            </Modal> */}
            {/* Smart Time popup end here */}
            {/* Created Date Popup */}
            {/* <Modal
                isOpen={CreatedmodalIsOpen}
                onDismiss={setModalSmartIsOpenToFalse}
                isBlocking={false}
                isModeless={true} >
                <div >
                    <div id="myDropdown4" className="dropdown-content">
                        <h4 className="col-sm-12 siteColor quickheader">
                            Created Date <span title="Close popup" className="pull-right hreflink"
                             onClick={setCreatedmodalIsOpenToFalse}>
                                <i className="fa fa-times-circle" aria-hidden="true"><FaRegTimesCircle /></i>
                            </span>
                        </h4>
                        <div className="col-md-12 mb-10 mt-10">
                            <select id="selectCreatedValue" className="form-control"
                            >
                                <option value="">Select</option>
                                <option value="Equal to">Equal to</option>
                                <option value="Greater than">Greater than</option>
                                <option value="Less than">Less than</option>
                                <option value="Not equal to">Not equal to</option>
                                <option value="In Between">In Between</option>
                                <option value="Presets">Presets</option>
                            </select>
                        </div>
                        <div
                            className="col-md-12 mb-10 mt-10 has-feedback has-feedback">
                            <input type="date" placeholder="dd/mm/yyyy"
                                className="form-control date-picker" id="txtDate4"
                            />
                            <i className="fa fa-calendar form-control-feedback mt-10"
                                style={{ marginRight: "10px" }}></i>
                        </div>
                        <div className="col-md-12 text-center PadR0 mb-10 mt-10">
                            <button type="button" 
                                className="btn btn-primary">
                                Apply
                            </button>
                            <button type="button" className="btn btn-default blocks"
                                >
                                Clear
                            </button>
                        </div>
                    </div>
                </div>
            </Modal> */}
            {/* Created Date popup end here */}
            {/* Due Date Popup */}
            {/* <Modal
                isOpen={DuemodalIsOpen}
                onDismiss={setDuemodalIsOpenToFalse}
                isBlocking={false}
                isModeless={true}
            >
                <div >
                    <div id="myDropdown4" className="dropdown-content">
                        <h4 className="col-sm-12 siteColor quickheader">
                            Due Date <span title="Close popup" className="pull-right hreflink"
                               onClick={setDuemodalIsOpenToFalse}>
                                <i className="fa fa-times-circle" aria-hidden="true"><FaRegTimesCircle /></i>
                            </span>
                        </h4>
                        <div className="col-md-12 mb-10 mt-10">
                            <select id="selectCreatedValue" className="form-control"
                             >
                                <option value="">Select</option>
                                <option value="Equal to">Equal to</option>
                                <option value="Greater than">Greater than</option>
                                <option value="Less than">Less than</option>
                                <option value="Not equal to">Not equal to</option>
                                <option value="In Between">In Between</option>
                                <option value="Presets">Presets</option>
                            </select>
                        </div>
                        <div
                            className="col-md-12 mb-10 mt-10 has-feedback has-feedback">
                            <input type="date" placeholder="dd/mm/yyyy"
                                className="form-control date-picker" id="txtDate4"
                              />
                            <i className="fa fa-calendar form-control-feedback mt-10"
                                style={{ marginRight: "10px" }}></i>
                        </div>
                        <div className="col-md-12 text-center PadR0 mb-10 mt-10">
                            <button type="button"
                                className="btn btn-primary">
                                Apply
                            </button>
                            <button type="button" className="btn btn-default blocks"
                            >
                                Clear
                            </button>
                        </div>
                    </div>
                </div>
            </Modal> */}
            {/* Due Date popup end here */}
            {/* Team Member Popup */}
            {/* <Modal
                isOpen={TeamMembermodalIsOpen}
                onDismiss={setTeamMembermodalIsOpenToFalse}
                isBlocking={false}
                isModeless={true} >
                <span >
                    <div id="myDropdown1" className="dropdown-content">
                        <h4 className="col-sm-12 siteColor quickheader">
                            Team Members <span title="Close popup" className="pull-right hreflink"
                               onClick={setTeamMembermodalIsOpenToFalse}>
                                <i className="fa fa-times-circle" aria-hidden="true"><FaRegTimesCircle /></i>
                            </span>
                        </h4>
                        <div className="col-sm-12 padL-0 ml5">
                            <div className="checkbox mb0 ml15">
                                <input  type="checkbox"
                                    name="Responsibility1"
                                    /><span className=" f-500">
                                    Select All
                                </span>
                            </div>
                        </div>
                        <div className="col-sm-12 PadR0 ml5">
                            {filterGroups.map(function (item) {
                                return (
                                    <>
                                        {item == 'Team Members' &&
                                            <td valign="top">
                                                <fieldset>
                                                    <legend>{item == 'Team Members' && <span>{item}</span>}</legend>
                                                    <legend>{item == 'teamSites' && <span>Sites</span>}</legend>
                                                </fieldset>
                                                {filterItems.map(function (ItemType, index) {
                                                    return (
                                                        <>
                                                            <div style={{ display: "block" }}> {ItemType.Group == item &&
                                                                <>
                                                                    <span className="plus-icon hreflink" onClick={() => handleOpen2(ItemType)}>
                                                                        {ItemType.childs.length > 0 &&
                                                                            <a className='hreflink'
                                                                                title="Tap to expand the childs">
                                                                                {ItemType.showItem ? <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png" />
                                                                                    : <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png" />}
                                                                            </a>}
                                                                    </span>
                                                                    {ItemType.TaxType != 'Status' &&
                                                                        <span className="ml-1">
                                                                            <input type="checkbox" className="mr0 icon-input" value={ItemType.Title} onChange={(e) => SingleLookDatatest(e, ItemType, index)} />
                                                                            <span className="ml-2">
                                                                                {ItemType.Title}
                                                                            </span>
                                                                        </span>
                                                                    }
                                                                    {ItemType.TaxType == 'Status' &&
                                                                        <span className="ml-2">
                                                                            <input type="checkbox" className="mr0 icon-input" value={ItemType.Title} onChange={(e) => SingleLookDatatest(e, ItemType, index)} />
                                                                            <span className="ml-2">
                                                                                {ItemType.Title}
                                                                            </span>
                                                                        </span>
                                                                    }
                                                                    <ul id="id_{ItemType.Id}"
                                                                        className="subfilter width-85">
                                                                        <span>
                                                                            {ItemType.show && (
                                                                                <>
                                                                                    {ItemType.childs.map(function (child1: any, index: any) {
                                                                                        return (
                                                                                            <>
                                                                                                <div style={{ display: "block" }}>
                                                                                                    {child1.childs.length > 0 && !child1.expanded &&
                                                                                                        <span className="plus-icon hreflink"
                                                                                                         >
                                                                                                            <img
                                                                                                                src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png" />
                                                                                                        </span>
                                                                                                    }
                                                                                                    {child1.childs.length > 0 && child1.expanded &&
                                                                                                        <span className="plus-icon hreflink"
                                                                                                         >
                                                                                                            <img
                                                                                                                src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png" />
                                                                                                        </span>
                                                                                                    }
                                                                                                    <input type="checkbox" className="icon-input mr0" 
                                                                                                        onChange={(e) => SingleLookDatatest(e, child1, index)} /> {child1.Title}
                                                                                                    <ul id="id_{{child1.Id}}" style={{ display: "none" }} className="subfilter"
                                                                                                    >
                                                                                                        {child1.childs.map(function (child2: any) {
                                                                                                            <li>
                                                                                                                <input type="checkbox"
                                                                                                                    onChange={(e) => SingleLookDatatest(e, child1, index)} /> {child2.Title}
                                                                                                            </li>
                                                                                                        })}
                                                                                                    </ul>
                                                                                                </div>
                                                                                            </>
                                                                                        )
                                                                                    })}
                                                                                </>
                                                                            )}
                                                                        </span>
                                                                    </ul>
                                                                </>
                                                            }
                                                            </div>
                                                        </>
                                                    )
                                                })}
                                            </td>
                                        }
                                    </>
                                )
                            })}
                        </div>
                        <div className="col-md-12 text-center padL-0 PadR0 mb-10 mt-10">
                            <button type="button" 
                                className="btn btn-primary">
                                Apply
                            </button>
                            <button type="button" className="btn btn-default blocks"
                          >
                                Clear
                            </button>
                        </div>
                    </div>
                </span>
            </Modal> */}
            {/* Team Member popup end here */}
            {/* Item Rank Popup */}
            {/* <Modal
                isOpen={ItemRankmodalIsOpen}
                onDismiss={setItemRankmodalIsOpenToFalse}
                isBlocking={false}
                isModeless={true}>
                <span >
                    <div id="myDropdown1" className="dropdown-content">
                        <h4 className="col-sm-12 siteColor quickheader">
                            Item Rank <span title="Close popup" className="pull-right hreflink"
                                onClick={setItemRankmodalIsOpenToFalse}>
                                <i className="fa fa-times-circle" aria-hidden="true"><FaRegTimesCircle /></i>
                            </span>
                        </h4>
                        <div className="col-sm-12 padL-0 ml5" >
                            <div className="checkbox mb0 ml15">
                                <input  type="checkbox" name="ItemRank1"
                                   /><span className="f-500">Select All</span>
                            </div>
                        </div>
                        {AllItemRank.map(item => {
                            return (
                                <div className="col-sm-12 PadR0 ml5">
                                    <div className="col-sm-12 padL-0 PadR0 checkbox mb0 ml15"
                                  >
                                        <input type="checkbox"
                                            name="ItemRank" /><span className="">
                                            {item.Title}
                                        </span>
                                    </div>
                                </div>
                            )
                        })}
                        <div className="col-md-12 padL-0 text-center PadR0 mb-10 mt-10">
                            <button type="button" 
                                className="btn btn-primary">
                                Apply
                            </button>
                            <button type="button" className="btn btn-default blocks"
                            >
                                Clear
                            </button>
                        </div>
                    </div>
                </span>
            </Modal> */}
            {/* Item Rank popup end here */}
            {/* Status Popup */}
            {/* <Modal
                isOpen={StatusmodalIsOpen}
                onDismiss={setStatusmodalIsOpenToFalse}
                isBlocking={false}
                isModeless={true}
            >
                <span >
                    <div id="myDropdown1" className="dropdown-content">
                        <h4 className="col-sm-12 siteColor quickheader">
                            Status <span title="Close popup" className="pull-right hreflink"
                                onClick={setStatusmodalIsOpenToFalse}>
                                <i className="fa fa-times-circle" aria-hidden="true"><FaRegTimesCircle /></i>
                            </span>
                        </h4>
                        <div className="col-sm-12 padL-0 ml5">
                            <div className="checkbox mb0 ml15 f-500">
                                <span className="">
                                    <input  type="checkbox"
                                        name="PercentComplete1"
                                    />
                                    Select All
                                </span>
                            </div>
                        </div>
                        <div className="col-sm-12 PadR0 ml5">
                            {AllItems.map(items => {
                                return (
                                    <div className="col-sm-12 padL-0 PadR0 checkbox mb0 ml15"
                                  >
                                        <input type="checkbox"
                                            name="PercentComplete" /><span className="">
                                            {items.Title}%
                                        </span>
                                    </div>
                                )
                            })}
                        </div>
                        <div className="col-md-12 padL-0 PadR0 text-center mb-10 mt-10">
                            <button type="button" 
                                className="btn btn-primary">
                                Apply
                            </button>
                            <button type="button" className="btn btn-default blocks"
                           >
                                Clear
                            </button>
                        </div>
                    </div>
                </span>
            </Modal> */}
            {/* Status popup end here */}
            <div className="Alltable mt-10">
                <div className="tbl-headings">
                    <span className="leftsec">
                        <span className=''>
                            {props.Portfolio_x0020_Type == 'Component' && props.Item_x0020_Type != 'SubComponent' && props.Item_x0020_Type != 'Feature' &&
                                <>
                                    <img className='client-icons' src={GlobalConstants.MAIN_SITE_URL + "/SiteCollectionImages/ICONS/Shareweb/component_icon.png"} />    <a>{props.Title}</a>
                                </>
                            }
                            {props.Portfolio_x0020_Type == 'Service' && props.Item_x0020_Type != 'SubComponent' && props.Item_x0020_Type != 'Feature' &&
                                <>
                                    <img className='client-icons' src={GlobalConstants.MAIN_SITE_URL + "/SiteCollectionImages/ICONS/Service_Icons/component_icon.png"} />  <a>{props.Title}</a>
                                </>}
                            {props.Portfolio_x0020_Type == 'Component' && props.Item_x0020_Type == 'SubComponent' &&
                                <>
                                    {props.Parent != undefined &&
                                        <a target='_blank' data-interception="off"
                                            href={GlobalConstants.MAIN_SITE_URL + `/SP/SitePages/Portfolio-Profile.aspx?taskId=${props.Parent.Id}`}>
                                            <img className='client-icons' src={GlobalConstants.MAIN_SITE_URL + "/SiteCollectionImages/ICONS/Shareweb/component_icon.png"} />
                                        </a>
                                    } {'>'} <img className='client-icons' src={GlobalConstants.MAIN_SITE_URL + "/SiteCollectionImages/ICONS/Shareweb/subComponent_icon.png"} />    <a>{props.Title}</a>
                                </>
                            }
                            {props.Portfolio_x0020_Type == 'Service' && props.Item_x0020_Type == 'SubComponent' &&
                                <>
                                    {props.Parent != undefined &&
                                        <a target='_blank' data-interception="off"
                                            href={GlobalConstants.MAIN_SITE_URL + `/SP/SitePages/Portfolio-Profile.aspx?taskId=${props.Parent.Id}`}>
                                            <img className='client-icons' src={GlobalConstants.MAIN_SITE_URL + "/SiteCollectionImages/ICONS/Service_Icons/component_icon.png"} />
                                        </a>
                                    } {'>'}
                                    <img className='client-icons' src={GlobalConstants.MAIN_SITE_URL + "/SiteCollectionImages/ICONS/Service_Icons/subcomponent_icon.png"} />    <a>{props.Title}</a>
                                </>
                            }

                            {props.Portfolio_x0020_Type == 'Component' && props.Item_x0020_Type == 'Feature' &&
                                <>

                                    {props.Parent != undefined &&
                                        <a target='_blank' data-interception="off"
                                            href={GlobalConstants.MAIN_SITE_URL + `/SP/SitePages/Portfolio-Profile.aspx?taskId=${props.Parent.Id}`}>
                                            <img className='client-icons' src={GlobalConstants.MAIN_SITE_URL + "/SiteCollectionImages/ICONS/Shareweb/component_icon.png"} />
                                        </a>

                                    } {'>'}  {(props.Parent.ItemType != undefined && props.Parent.ItemType == "SubComponent") &&
                                        <a target='_blank' data-interception="off"
                                            href={GlobalConstants.MAIN_SITE_URL + `/SP/SitePages/Portfolio-Profile.aspx?taskId=${props.Parent.Id}`}>
                                            <img className='client-icons' src={GlobalConstants.MAIN_SITE_URL + "/SiteCollectionImages/ICONS/Shareweb/subComponent_icon.png"} />
                                        </a>
                                    }  {'>'}  <img className='client-icons' src={GlobalConstants.MAIN_SITE_URL + "/SiteCollectionImages/ICONS/Shareweb/feature_icon.png"} />    <a>{props.Title}</a>
                                </>
                            }
                            {props.Portfolio_x0020_Type == 'Service' && props.Item_x0020_Type == 'Feature' &&
                                <>
                                    {props.Parent != undefined &&
                                        <a target='_blank' data-interception="off"
                                            href={GlobalConstants.MAIN_SITE_URL + `/SitePages/Portfolio-Profile.aspx?taskId=${props.Parent.Id}`}>
                                            <img className='client-icons' src={GlobalConstants.MAIN_SITE_URL + "/SiteCollectionImages/ICONS/Service_Icons/component_icon.png"} />
                                        </a>
                                    } {'>'} {(props.Parent.ItemType != undefined && props.Parent.ItemType == "SubComponent") &&
                                        <a target='_blank' data-interception="off"
                                            href={GlobalConstants.MAIN_SITE_URL + `/SP/SitePages/Portfolio-Profile.aspx?taskId=${props.Parent.Id}`}>
                                            <img className='client-icons' title={props.Parent.Title} src={GlobalConstants.MAIN_SITE_URL + "/SiteCollectionImages/ICONS/Service_Icons/subcomponent_icon.png"} />
                                        </a>
                                    }  {'>'}  <img className='client-icons' title={props.Title} src={GlobalConstants.MAIN_SITE_URL + "/SiteCollectionImages/ICONS/Service_Icons/feature_icon.png"} />    <a>{props.Title}</a>
                                </>
                            }
                        </span>
                        <span className="g-search">
                            <input type="text" className="searchbox_height full_width" id="globalSearch" placeholder="search all"
                                onChange={(e) => handleChange1(e, "Title")} />
                            <span className="gsearch-btn" ng-click="SearchAll_Item()"><i className="fa fa-search"></i></span>
                        </span>
                    </span>
                    <span className="toolbox mx-auto">
                        {checkedList != undefined && checkedList.length > 0 && checkedList[0].Item_x0020_Type === 'Feature' ?
                            <button type="button" disabled={true} className="btn btn-primary" onClick={addModal} title=" Add Structure">
                                Add Structure
                            </button>
                            : <button type="button" disabled={checkedList.length >= 2} className="btn btn-primary" onClick={addModal} title=" Add Structure">
                                Add Structure
                            </button>}


                        {/* {(selectedCategory != undefined && selectedCategory.length > 0) ?
                            <button type="button" onClick={() => setLgShow(true)}
                                disabled={ActivityDisable} className="btn btn-primary" title=" Add Activity-Task">
                                Add Activity-Task
                            </button>
                            :*/}
                        <button type="button" onClick={() => openActivity()}
                            disabled={ActivityDisable} className="btn btn-primary" title=" Add Activity-Task">
                            Add Activity-Task
                        </button>

                        <button type="button" className="btn btn-primary"
                            onClick={buttonRestructuring}>
                            Restructure
                        </button>
                        <button type="button"
                            className="btn {{(compareComponents.length==0 && SelectedTasks.length==0)?'btn-grey':'btn-primary'}}"
                            disabled={true}>
                            Compare
                        </button>
                        <a className='expand'>
                            <ExpndTable prop={expndpopup} prop1={tablecontiner} />
                        </a>
                        <a>
                            <Tooltip ComponentId='1748' />

                        </a>
                    </span>
                </div>
                <div className="col-sm-12 pad0 smart" >
                    <div className="section-event">
                        <div className="wrapper">
                            <table className="table table-hover" id="EmpTable" style={{ width: "100%" }}>
                                <thead>
                                    <tr>
                                        <th style={{ width: "2%" }}>
                                            <div style={{ width: "2%" }}>
                                                <div className="smart-relative sign hreflink" onClick={() => handleOpenAll()} >{Isshow ? <img src={(IsUpdated != undefined && IsUpdated.toLowerCase().indexOf('service') > -1) ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png" : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/list-icon.png'} />
                                                    : <img src={(IsUpdated != undefined && IsUpdated.toLowerCase().indexOf('service') > -1) ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png" : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/right-list-icon.png"} />}
                                                </div>
                                            </div>
                                        </th>
                                        <th style={{ width: "6%" }}>
                                            <div style={{ width: "6%" }}></div>
                                        </th>
                                        <th style={{ width: "7%" }}>
                                            <div style={{ width: "6%" }} className="smart-relative">
                                                <input type="search" placeholder="TaskId" className="full_width searchbox_height"
                                                    onChange={(e) => handleChange1(e, "Shareweb_x0020_ID")}
                                                />
                                                <span className="sorticon">
                                                    <span className="up" onClick={sortBy}>< FaAngleUp /></span>
                                                    <span className="down" onClick={sortByDng}>< FaAngleDown /></span>
                                                </span>
                                            </div>
                                        </th>
                                        <th style={{ width: "23%" }}>
                                            <div style={{ width: "22%" }} className="smart-relative">
                                                <input type="search" placeholder="Title" className="full_width searchbox_height"
                                                    onChange={(e) => handleChange1(e, "Title")}
                                                />
                                                <span className="sorticon">
                                                    <span className="up" onClick={sortBy}>< FaAngleUp /></span>
                                                    <span className="down" onClick={sortByDng}>< FaAngleDown /></span>
                                                </span>
                                            </div>
                                        </th>
                                        <th style={{ width: "7%" }}>
                                            <div style={{ width: "6%" }} className="smart-relative">
                                                <input id="searchClientCategory" type="search" placeholder="Client Category"
                                                    title="Client Category" className="full_width searchbox_height"
                                                // onChange={(e) => handleChange1(e, "ClientCategory")} 
                                                />
                                                <span className="sorticon">
                                                    <span className="up" onClick={sortBy}>< FaAngleUp /></span>
                                                    <span className="down" onClick={sortByDng}>< FaAngleDown /></span>
                                                </span>
                                            </div>
                                        </th>
                                        <th style={{ width: "4%" }}>
                                            <div style={{ width: "4%" }} className="smart-relative">
                                                <input id="searchClientCategory" type="search" placeholder="%"
                                                    title="Percentage Complete" className="full_width searchbox_height"
                                                    onChange={(e) => handleChange1(e, "PercentComplete")}
                                                />
                                                <span className="sorticon">
                                                    <span className="up" onClick={sortBy}>< FaAngleUp /></span>
                                                    <span className="down" onClick={sortByDng}>< FaAngleDown /></span>
                                                </span>
                                                {/* <Dropdown className='dropdown-fliter'>
                                                    <Dropdown.Toggle className='iconsbutton' variant="success" id="dropdown-basic">
                                                        <FaFilter />
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu>
                                                        <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                                                        <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                                                        <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown> */}
                                                {/* <span className="dropdown filer-icons">
                                                                    <span className="filter-iconfil"
                                                                        onClick={setStatusmodalIsOpenToTrue}
                                                                    >
                                                                        <i ><FaFilter onClick={setStatusmodalIsOpenToTrue} /></i>
                                                                    </span></span> */}
                                            </div>
                                        </th>
                                        <th style={{ width: "7%" }}>
                                            <div style={{ width: "6%" }} className="smart-relative">
                                                <input id="searchClientCategory" type="search" placeholder="ItemRank"
                                                    title="Item Rank" className="full_width searchbox_height"
                                                // onChange={(e) => handleChange1(e, "ItemRank")}
                                                />
                                                <span className="sorticon">
                                                    <span className="up" onClick={sortBy}>< FaAngleUp /></span>
                                                    <span className="down" onClick={sortByDng}>< FaAngleDown /></span>
                                                </span>
                                                {/* <Dropdown className='dropdown-fliter'>
                                                    <Dropdown.Toggle className='iconsbutton' variant="success" id="dropdown-basic">
                                                        <FaFilter />
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu>
                                                        <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                                                        <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                                                        <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown> */}
                                                {/* <span className="dropdown filer-icons">
                                                                    <span className="filter-iconfil"
                                                                        onClick={setItemRankmodalIsOpenToTrue}
                                                                    >
                                                                        <i ><FaFilter onClick={setItemRankmodalIsOpenToTrue} /></i>
                                                                    </span>
                                                                </span> */}
                                            </div>
                                        </th>
                                        <th style={{ width: "10%" }}>
                                            <div style={{ width: "9%" }} className="smart-relative">
                                                <input id="searchClientCategory" type="search" placeholder="Team"
                                                    title="Team" className="full_width searchbox_height"
                                                // onChange={(e) => handleChange1(e, "Team")}
                                                />
                                                <span className="sorticon">
                                                    <span className="up" onClick={sortBy}>< FaAngleUp /></span>
                                                    <span className="down" onClick={sortByDng}>< FaAngleDown /></span>
                                                </span>
                                                {/* <Dropdown className='dropdown-fliter'>
                                                    <Dropdown.Toggle className='iconsbutton' variant="success" id="dropdown-basic">
                                                        <FaFilter />
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu>
                                                        <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                                                        <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                                                        <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown> */}
                                                {/* <span className="dropdown filer-icons">
                                                                    <span className="filter-iconfil"
                                                                        onClick={setTeamMembermodalIsOpenToTrue}
                                                                    >
                                                                        <i ><FaFilter onClick={setTeamMembermodalIsOpenToTrue} /></i>
                                                                    </span>
                                                                </span> */}
                                            </div>
                                        </th>
                                        <th style={{ width: "9%" }}>
                                            <div style={{ width: "8%" }} className="smart-relative">
                                                <input id="searchClientCategory" type="search" placeholder="Due Date"
                                                    title="Due Date" className="full_width searchbox_height"
                                                    onChange={(e) => handleChange1(e, "DueDate")}
                                                />
                                                <span className="sorticon">
                                                    <span className="up" onClick={sortBy}>< FaAngleUp /></span>
                                                    <span className="down" onClick={sortByDng}>< FaAngleDown /></span>
                                                </span>
                                                {/* <Dropdown className='dropdown-fliter'>
                                                    <Dropdown.Toggle className='iconsbutton' variant="success" id="dropdown-basic">
                                                        <FaFilter />
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu>
                                                        <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                                                        <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                                                        <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown> */}
                                                {/* <span className="dropdown filer-icons">
                                                                    <span className="filter-iconfil"
                                                                        onClick={setDuemodalIsOpenToTrue}
                                                                    >
                                                                        <i ><FaFilter onClick={setDuemodalIsOpenToTrue} /></i>
                                                                    </span>
                                                                </span> */}
                                            </div>
                                        </th>
                                        <th style={{ width: "11%" }}>
                                            <div style={{ width: "10%" }} className="smart-relative">
                                                <input id="searchClientCategory" type="search" placeholder="Created Date"
                                                    title="Created Date" className="full_width searchbox_height"
                                                // onChange={(e) => handleChange1(e, "Created")} 
                                                />
                                                <span className="sorticon">
                                                    <span className="up" onClick={sortBy}>< FaAngleUp /></span>
                                                    <span className="down" onClick={sortByDng}>< FaAngleDown /></span>
                                                </span>
                                                {/* <Dropdown className='dropdown-fliter'>
                                                    <Dropdown.Toggle className='iconsbutton' variant="success" id="dropdown-basic">
                                                        <FaFilter />
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu>
                                                        <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                                                        <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                                                        <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown> */}
                                                {/* <span className="dropdown filer-icons">
                                                                    <span className="filter-iconfil"
                                                                        //  href="#myDropdown1"
                                                                        onClick={setCreatedmodalIsOpenToTrue}
                                                                    >
                                                                        <i ><FaFilter onClick={setCreatedmodalIsOpenToTrue} /></i>
                                                                    </span>
                                                                </span> */}
                                            </div>
                                        </th>
                                        <th style={{ width: "7%" }}>
                                            <div style={{ width: "6%" }} className="smart-relative">
                                                <input id="searchClientCategory" type="search" placeholder="Smart Time"
                                                    title="Smart Time" className="full_width searchbox_height"
                                                // onChange={(e) => handleChange1(e, "Due")} 
                                                />
                                                <span className="sorticon">
                                                    <span className="up" onClick={sortBy}>< FaAngleUp /></span>
                                                    <span className="down" onClick={sortByDng}>< FaAngleDown /></span>
                                                </span>
                                                {/* <Dropdown className='dropdown-fliter'>
                                                    <Dropdown.Toggle className='iconsbutton' variant="success" id="dropdown-basic">
                                                        <FaFilter />
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu>
                                                        <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                                                        <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                                                        <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown> */}
                                                {/* <span className="dropdown filer-icons">
                                                                    <span className="filter-iconfil"
                                                                        //  href="#myDropdown1"
                                                                        onClick={setModalSmartIsOpenToTrue}
                                                                    >
                                                                        <i ><FaFilter onClick={setModalSmartIsOpenToTrue} /></i>
                                                                    </span>
                                                                </span> */}
                                            </div>
                                        </th>
                                        <th style={{ width: "3%" }}>
                                            <div style={{ width: "2%" }}></div>
                                        </th>
                                        <th style={{ width: "3%" }}>
                                            <div style={{ width: "2%" }}></div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <div id="SpfxProgressbar" style={{ display: "none" }}>
                                        <img id="sharewebprogressbar-image" src={GlobalConstants.MAIN_SITE_URL + "/SiteCollectionImages/ICONS/32/loading_apple.gif"} alt="Loading..." />
                                    </div>
                                    {data?.length > 0 && data && data.map(function (item, index) {

                                        if (item.flag == true) {
                                            return (
                                                <>
                                                    <tr >
                                                        <td className="p-0" colSpan={13}>
                                                            <table className="table m-0" style={{ width: "100%" }}>
                                                                <tr className="bold for-c0l">
                                                                    <td style={{ width: "2%" }}>


                                                                        <div className="accordian-header" >
                                                                            {item.childs != undefined && item.childs.length > 0 &&
                                                                                <a className='hreflink'
                                                                                    title="Tap to expand the childs">
                                                                                    <div onClick={() => handleOpen(item)} className="sign">{item.childs.length > 0 && item.show ? <img src={item.downArrowIcon} />
                                                                                        : <img src={item.RightArrowIcon} />}
                                                                                    </div>
                                                                                </a>
                                                                            }
                                                                        </div>

                                                                    </td>
                                                                    <td style={{ width: "6%" }}>
                                                                        <div className="d-flex">
                                                                            <span className='pe-2'><input type="checkbox" checked={item.chekBox}
                                                                                onChange={(e) => onChangeHandler(item, 'Parent', e)} />
                                                                                <a className="hreflink" data-toggle="modal">
                                                                                    <img className="icon-sites-img ml20" src={item.SiteIcon}></img>
                                                                                </a>
                                                                            </span>
                                                                        </div>
                                                                    </td>
                                                                    <td style={{ width: "7%" }}><span className="ml-2">{item.Shareweb_x0020_ID}</span></td>
                                                                    <td style={{ width: "23%" }}>
                                                                        {/* {item.siteType == "Master Tasks" && <a className="hreflink serviceColor_Active" onClick={() => window.open(GlobalConstants.MAIN_SITE_URL + `/SP/SitePages/Portfolio-Profile.aspx?taskId= + ${item.Id}`, '_blank')} */}
                                                                        {item.siteType === "Master Tasks" && <a className="hreflink serviceColor_Active" target='_blank' data-interception="off"
                                                                            href={GlobalConstants.MAIN_SITE_URL + "/SP/SitePages/Portfolio-Profile.aspx?taskId=" + item.Id}
                                                                        >
                                                                            <span dangerouslySetInnerHTML={{ __html: item.TitleNew }}></span>
                                                                            {/* {item.TitleNew} */}

                                                                        </a>}
                                                                        {item.siteType != "Master Tasks" && <a className="hreflink serviceColor_Active" target='_blank' data-interception="off"
                                                                            href={GlobalConstants.MAIN_SITE_URL + "/SP/SitePages/Task-Profile.aspx?taskId=" + item.Id + '&Site=' + item.siteType}
                                                                        >
                                                                            <span dangerouslySetInnerHTML={{ __html: item?.TitleNew }}></span>
                                                                        </a>}
                                                                        {item.childs != undefined && item.childs.length > 0 &&
                                                                            <span>{item.childs.length == 0 ? "" : <span className='ms-1'>({item.childsLength})</span>}</span>
                                                                        }
                                                                        {item.Short_x0020_Description_x0020_On != null &&
                                                                            // <span className="project-tool"><img
                                                                            //     src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/infoIcon.png" /><span className="tooltipte">
                                                                            //         <span className="tooltiptext">
                                                                            //             <div className="tooltip_Desc">
                                                                            //                 <span>{item.Short_x0020_Description_x0020_On}</span>
                                                                            //             </div>
                                                                            //         </span>
                                                                            //     </span>
                                                                            // </span>
                                                                            <div className='popover__wrapper ms-1' data-bs-toggle="tooltip" data-bs-placement="auto">
                                                                                <img src={GlobalConstants.MAIN_SITE_URL + "/SP/SiteCollectionImages/ICONS/24/infoIcon.png"} />
                                                                                <div className="popover__content">
                                                                                    {item.Short_x0020_Description_x0020_On}
                                                                                </div>
                                                                            </div>
                                                                        }
                                                                    </td>
                                                                    <td style={{ width: "7%" }}>
                                                                        <div>
                                                                            {item.ClientCategory != undefined && item.ClientCategory.length > 0 && item.ClientCategory.map(function (client: { Title: string; }) {
                                                                                return (
                                                                                    <span className="ClientCategory-Usericon"
                                                                                        title={client.Title}>
                                                                                        <a>{client.Title.slice(0, 2).toUpperCase()}</a>
                                                                                    </span>
                                                                                )
                                                                            })}</div>
                                                                    </td>
                                                                    <td style={{ width: "4%" }}>{item.PercentComplete}</td>
                                                                    <td style={{ width: "7%" }}>{item.ItemRank}</td>
                                                                    <td style={{ width: "10%" }}>
                                                                        <div>
                                                                            <ShowTaskTeamMembers props={item} TaskUsers={AllUsers}></ShowTaskTeamMembers>

                                                                        </div>
                                                                    </td>


                                                                    <td style={{ width: "9%" }}>{item.DueDate}</td>
                                                                    <td style={{ width: "11%" }}>
                                                                        {item.Created != null ? Moment(item.Created).format('DD/MM/YYYY') : ""}
                                                                        {item.Created != null ? "" : <>
                                                                            {item.Author != undefined ? <img className='AssignUserPhoto' title={item.Author.Title} src={findUserByName(item.Author.Title)} /> : <img className='AssignUserPhoto' src="https://hhhhteams.sharepoint.com/sites/HHHH/PublishingImages/Portraits/icon_user.jpg" />} </>}
                                                                    </td>

                                                                    <td style={{ width: "7%" }}>
                                                                        {/* {item.Item_x0020_Type == 'Task' && item.TimeSpent != null &&
                                                                            <>
                                                                            {item.TimeSpent.toFixed(1)}
                                                                          </>
                                                                          } */}
                                                                    </td>

                                                                    <td style={{ width: "3%" }}>{item.Item_x0020_Type == 'Task' && item.siteType != "Master Tasks" && <a onClick={(e) => EditData(e, item)}><img style={{ width: "22px" }} src={GlobalConstants.MAIN_SITE_URL + "/SP/SiteCollectionImages/ICONS/24/clock-gray.png"}></img></a>}</td>
                                                                    <td style={{ width: "3%" }}><a>{item.siteType == "Master Tasks" && <img src="https://hhhhteams.sharepoint.com/_layouts/images/edititem.gif" onClick={(e) => EditComponentPopup(item)} />}
                                                                        {item.Item_x0020_Type == 'Task' && item.siteType != "Master Tasks" && <img src="https://hhhhteams.sharepoint.com/_layouts/images/edititem.gif" onClick={(e) => EditItemTaskPopup(item)} />}</a></td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                    {item.show && item.childs.length > 0 && (
                                                        <>
                                                            {item.childs.map(function (childitem: any) {
                                                                if (childitem.flag == true) {
                                                                    return (
                                                                        <>
                                                                            <tr >
                                                                                <td className="p-0" colSpan={13}>
                                                                                    <table className="table m-0" style={{ width: "100%" }}>
                                                                                        <tr className="for-c02">
                                                                                            <td style={{ width: "2%" }}>
                                                                                                <div onClick={() => handleOpen(childitem)} className="sign">{childitem.childs?.length > 0 && childitem.show ? <img src={childitem.downArrowIcon} />
                                                                                                    : <img src={childitem.RightArrowIcon} />}
                                                                                                </div>
                                                                                            </td>
                                                                                            <td style={{ width: "6%" }}>
                                                                                                <span className='pe-2'><input type="checkbox" checked={childitem.chekBox} onChange={(e) => onChangeHandler(childitem, item, e)} />
                                                                                                    <a className="hreflink" data-toggle="modal">
                                                                                                        <img className="icon-sites-img ml20" src={childitem.SiteIcon}></img>
                                                                                                    </a>
                                                                                                </span>
                                                                                            </td>
                                                                                            <td style={{ width: "7%" }}>  <span className="ml-2">{childitem.Shareweb_x0020_ID}</span>
                                                                                            </td>
                                                                                            <td style={{ width: "23%" }}>
                                                                                                {childitem.siteType == "Master Tasks" && <a className="hreflink serviceColor_Active" target='_blank' data-interception="off"
                                                                                                    href={GlobalConstants.MAIN_SITE_URL + "/SP/SitePages/Portfolio-Profile.aspx?taskId=" + childitem.Id}
                                                                                                >
                                                                                                    <span dangerouslySetInnerHTML={{ __html: childitem?.TitleNew }}></span>

                                                                                                </a>}
                                                                                                {childitem.siteType != "Master Tasks" && <a className="hreflink serviceColor_Active" target='_blank' data-interception="off"
                                                                                                    href={GlobalConstants.MAIN_SITE_URL + "/SP/SitePages/Task-Profile.aspx?taskId=" + childitem.Id + '&Site=' + childitem.siteType}
                                                                                                >

                                                                                                    <span dangerouslySetInnerHTML={{ __html: childitem?.TitleNew }}></span>

                                                                                                </a>}
                                                                                                {childitem.childs != undefined && childitem.childs.length > 0 &&
                                                                                                    <span className='ms-1'>({childitem.childsLength})</span>
                                                                                                }
                                                                                                {childitem.Short_x0020_Description_x0020_On != null &&
                                                                                                    // <span className="project-tool"><img
                                                                                                    //     src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/infoIcon.png" /><span className="tooltipte">
                                                                                                    //         <span className="tooltiptext">
                                                                                                    //             <div className="tooltip_Desc">
                                                                                                    //                 <span>{childitem.Short_x0020_Description_x0020_On}</span>
                                                                                                    //             </div>
                                                                                                    //         </span>
                                                                                                    //     </span>
                                                                                                    // </span>
                                                                                                    <div className='popover__wrapper ms-1' data-bs-toggle="tooltip" data-bs-placement="auto">
                                                                                                        <img src={GlobalConstants.MAIN_SITE_URL + "/SP/SiteCollectionImages/ICONS/24/infoIcon.png"} />
                                                                                                        <div className="popover__content">
                                                                                                            {childitem.Short_x0020_Description_x0020_On}
                                                                                                        </div>
                                                                                                    </div>
                                                                                                }
                                                                                            </td>
                                                                                            <td style={{ width: "7%" }}>
                                                                                                <div>
                                                                                                    {childitem.ClientCategory != undefined && childitem.ClientCategory.length > 0 && childitem.ClientCategory.map(function (client: { Title: string; }) {
                                                                                                        return (
                                                                                                            <span className="ClientCategory-Usericon"
                                                                                                                title={client.Title}>
                                                                                                                <a>{client.Title.slice(0, 2).toUpperCase()}</a>
                                                                                                            </span>
                                                                                                        )
                                                                                                    })}</div>
                                                                                            </td>
                                                                                            <td style={{ width: "4%" }}>{childitem.PercentComplete}</td>
                                                                                            <td style={{ width: "7%" }}>{childitem.ItemRank}</td>
                                                                                            <td style={{ width: "10%" }}><div>
                                                                                                <ShowTaskTeamMembers props={childitem} TaskUsers={AllUsers}></ShowTaskTeamMembers>
                                                                                            </div></td>
                                                                                            <td style={{ width: "9%" }}>{childitem.DueDate}</td>
                                                                                            <td style={{ width: "11%" }}>
                                                                                                {childitem.Created != null ? Moment(childitem.Created).format('DD/MM/YYYY') : ""}
                                                                                                {childitem.Author != undefined ?
                                                                                                    <img className='AssignUserPhoto' title={childitem.Author.Title} src={findUserByName(childitem.Author.Title)} />
                                                                                                    : <img className='AssignUserPhoto' src="https://hhhhteams.sharepoint.com/sites/HHHH/PublishingImages/Portraits/icon_user.jpg" />}
                                                                                            </td>


                                                                                            <td style={{ width: "7%" }}>
                                                                                                {/* {childitem.Item_x0020_Type == 'Task' &&
                                                                                                <>
                                                                                                  {smartTime.toFixed(1)}
                                                                                                </>
                                                                                                }
                                                                                                 {SmartTimes? <SmartTimeTotal props={childitem} CallBackSumSmartTime={CallBackSumSmartTime} /> : null} */}
                                                                                            </td>

                                                                                            <td style={{ width: "3%" }}>{childitem.Item_x0020_Type == 'Task' && childitem.siteType != "Master Tasks" && <a onClick={(e) => EditData(e, childitem)}><img style={{ width: "22px" }} src={GlobalConstants.MAIN_SITE_URL + "/SP/SiteCollectionImages/ICONS/24/clock-gray.png"}></img></a>}</td>
                                                                                            <td style={{ width: "3%" }}><a>{childitem.siteType == "Master Tasks" && <img src="https://hhhhteams.sharepoint.com/_layouts/images/edititem.gif" onClick={(e) => EditComponentPopup(childitem)} />}
                                                                                                {childitem.Item_x0020_Type == 'Task' && childitem.siteType != "Master Tasks" && <img src="https://hhhhteams.sharepoint.com/_layouts/images/edititem.gif" onClick={(e) => EditItemTaskPopup(childitem)} />}</a></td>
                                                                                        </tr>
                                                                                    </table>
                                                                                </td>
                                                                            </tr>
                                                                            {childitem.show && childitem.childs.length > 0 && (
                                                                                <>
                                                                                    {childitem.childs.map(function (childinew: any) {
                                                                                        if (childinew.flag == true) {
                                                                                            return (
                                                                                                <>
                                                                                                    <tr >
                                                                                                        <td className="p-0" colSpan={13}>
                                                                                                            <table className="table m-0" style={{ width: "100%" }}>
                                                                                                                <tr className="tdrow">
                                                                                                                    <td style={{ width: "2%" }}>
                                                                                                                        <div className="accordian-header" onClick={() => handleOpen(childinew)}>
                                                                                                                            {childinew.childs.length > 0 &&
                                                                                                                                <a className='hreflink'
                                                                                                                                    title="Tap to expand the childs">
                                                                                                                                    <div className="sign">{childinew.childs.length > 0 && childinew.show ? <img src={childinew.downArrowIcon} />
                                                                                                                                        : <img src={childinew.RightArrowIcon} />}
                                                                                                                                    </div>
                                                                                                                                </a>
                                                                                                                            }

                                                                                                                        </div>

                                                                                                                    </td>
                                                                                                                    <td style={{ width: "6%" }}>
                                                                                                                        <span className='pe-2'><input type="checkbox" checked={childinew.chekBox} onChange={(e) => onChangeHandler(childinew, item, e)} />
                                                                                                                            <a className="hreflink" title="Show All Child" data-toggle="modal">
                                                                                                                                <img className="icon-sites-img ml20" src={childinew.SiteIcon}></img>
                                                                                                                            </a>
                                                                                                                        </span>
                                                                                                                    </td>
                                                                                                                    <td style={{ width: "7%" }}> <div className="d-flex">

                                                                                                                        <span className="ml-2">{childinew.Shareweb_x0020_ID}</span>
                                                                                                                    </div>
                                                                                                                    </td>
                                                                                                                    <td style={{ width: "23%" }}>
                                                                                                                        {childinew.siteType == "Master Tasks" && <a className="hreflink serviceColor_Active" target='_blank' data-interception="off"
                                                                                                                            href={GlobalConstants.MAIN_SITE_URL + "/SP/SitePages/Portfolio-Profile.aspx?taskId=" + childinew.Id}
                                                                                                                        >

                                                                                                                            <span dangerouslySetInnerHTML={{ __html: childinew?.TitleNew }}></span>


                                                                                                                        </a>}
                                                                                                                        {childinew.siteType != "Master Tasks" && <a className="hreflink serviceColor_Active" target='_blank' data-interception="off"
                                                                                                                            href={GlobalConstants.MAIN_SITE_URL + "/SP/SitePages/Task-Profile.aspx?taskId=" + childinew.Id + '&Site=' + childinew.siteType}
                                                                                                                        > <span dangerouslySetInnerHTML={{ __html: childinew?.TitleNew }}></span>
                                                                                                                        </a>}
                                                                                                                        {childinew.childs != undefined && childinew.childs.length > 0 &&
                                                                                                                            <span className='ms-1'>({childinew.childs.length})</span>
                                                                                                                        }
                                                                                                                        {childinew.Short_x0020_Description_x0020_On != null &&
                                                                                                                            // <span className="project-tool"><img
                                                                                                                            //     src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/infoIcon.png" /><span className="tooltipte">
                                                                                                                            //         <span className="tooltiptext">
                                                                                                                            //             <div className="tooltip_Desc">
                                                                                                                            //                 <span>{childinew.Short_x0020_Description_x0020_On}</span>
                                                                                                                            //             </div>
                                                                                                                            //         </span>
                                                                                                                            //     </span>
                                                                                                                            // </span>
                                                                                                                            <div className='popover__wrapper ms-1' data-bs-toggle="tooltip" data-bs-placement="auto">
                                                                                                                                <img src={GlobalConstants.MAIN_SITE_URL + "/SP/SiteCollectionImages/ICONS/24/infoIcon.png"} />
                                                                                                                                <div className="popover__content">
                                                                                                                                    {childinew.Short_x0020_Description_x0020_On}
                                                                                                                                </div>
                                                                                                                            </div>
                                                                                                                        }
                                                                                                                    </td>
                                                                                                                    <td style={{ width: "7%" }}>
                                                                                                                        <div>
                                                                                                                            {childinew.ClientCategory != undefined && childinew.ClientCategory.length > 0 && childinew.ClientCategory.map(function (client: { Title: string; }) {
                                                                                                                                return (
                                                                                                                                    <span className="ClientCategory-Usericon"
                                                                                                                                        title={client.Title}>
                                                                                                                                        <a>{client.Title.slice(0, 2).toUpperCase()}</a>
                                                                                                                                    </span>
                                                                                                                                )
                                                                                                                            })}</div>
                                                                                                                    </td>
                                                                                                                    <td style={{ width: "4%" }}>{childinew.PercentComplete}</td>
                                                                                                                    <td style={{ width: "7%" }}>{childinew.ItemRank}</td>
                                                                                                                    <td style={{ width: "10%" }}>
                                                                                                                        <div>
                                                                                                                            <ShowTaskTeamMembers props={childinew} TaskUsers={AllUsers}></ShowTaskTeamMembers>
                                                                                                                            {/* {childinew.TeamLeaderUser != undefined && childinew.TeamLeaderUser != undefined && childinew.TeamLeaderUser.map(function (client1: { Title: string; }) {
                                                                                                                        return (
                                                                                                                            <span className="AssignUserPhoto"
                                                                                                                                title={client1.Title}>
                                                                                                                                <a>{client1.Title.slice(0, 2).toUpperCase()}</a>
                                                                                                                            </span>
                                                                                                                        )
                                                                                                                    })} */}
                                                                                                                        </div>

                                                                                                                    </td>
                                                                                                                    <td style={{ width: "9%" }}>{childinew.DueDate}</td>
                                                                                                                    <td style={{ width: "11%" }}>
                                                                                                                        {childinew.Created != null ? Moment(childinew.Created).format('DD/MM/YYYY') : ""}

                                                                                                                        {childinew.Author != undefined ?
                                                                                                                            <img className='AssignUserPhoto' title={childinew.Author.Title} src={findUserByName(childinew.Author.Title)} />
                                                                                                                            : <img className='AssignUserPhoto' src="https://hhhhteams.sharepoint.com/sites/HHHH/PublishingImages/Portraits/icon_user.jpg" />}

                                                                                                                    </td>

                                                                                                                    <td style={{ width: "7%" }}>
                                                                                                                        {/* {childinew.Item_x0020_Type == 'Task' &&
                                                                                                                            <>
                                                                                                                            {smartTime.toFixed(1)}
                                                                                                                          </>
                                                                                                                          }
                                                                                                                           {SmartTimes? <SmartTimeTotal props={childinew} CallBackSumSmartTime={CallBackSumSmartTime} /> : null} */}
                                                                                                                    </td>

                                                                                                                    <td style={{ width: "3%" }}>{childinew.Item_x0020_Type == 'Task' && childinew.siteType != "Master Tasks" && <a onClick={(e) => EditData(e, childinew)}><img style={{ width: "22px" }} src={GlobalConstants.MAIN_SITE_URL + "/SP/SiteCollectionImages/ICONS/24/clock-gray.png"}></img></a>}</td>
                                                                                                                    <td style={{ width: "3%" }}><a>{childinew.siteType == "Master Tasks" && <img src="https://hhhhteams.sharepoint.com/_layouts/images/edititem.gif" onClick={(e) => EditComponentPopup(childinew)} />}
                                                                                                                        {childinew.Item_x0020_Type == 'Task' && childinew.siteType != "Master Tasks" && <img src="https://hhhhteams.sharepoint.com/_layouts/images/edititem.gif" onClick={(e) => EditItemTaskPopup(childinew)} />}</a></td>
                                                                                                                </tr>
                                                                                                            </table>
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                    {childinew.show && childinew.childs.length > 0 && (
                                                                                                        <>
                                                                                                            {childinew.childs.map(function (subchilditem: any) {
                                                                                                                return (
                                                                                                                    <>
                                                                                                                        <tr >
                                                                                                                            <td className="p-0" colSpan={13}>
                                                                                                                                <table className="table m-0" style={{ width: "100%" }}>
                                                                                                                                    <tr className="for-c02">
                                                                                                                                        <td style={{ width: "2%" }}>
                                                                                                                                            <div className="accordian-header" onClick={() => handleOpen(subchilditem)}>
                                                                                                                                                {subchilditem.childs.length > 0 &&
                                                                                                                                                    <a className='hreflink'
                                                                                                                                                        title="Tap to expand the childs">
                                                                                                                                                        <div className="sign">{subchilditem.childs.length > 0 && subchilditem.show ? <img src={subchilditem.downArrowIcon} />
                                                                                                                                                            : <img src={subchilditem.RightArrowIcon} />}
                                                                                                                                                        </div>
                                                                                                                                                    </a>
                                                                                                                                                }
                                                                                                                                            </div>
                                                                                                                                        </td>
                                                                                                                                        <td style={{ width: "6%" }}>
                                                                                                                                            <span className='pe-2'><input type="checkbox" onChange={(e) => onChangeHandler(subchilditem, item, e)} /></span>
                                                                                                                                            <span>
                                                                                                                                                <a className="hreflink" title="Show All Child" data-toggle="modal">
                                                                                                                                                    <img className="icon-sites-img ml20" src={subchilditem.SiteIcon}></img>
                                                                                                                                                </a>
                                                                                                                                            </span>
                                                                                                                                        </td>
                                                                                                                                        <td style={{ width: "7%" }}>  <div className="d-flex">

                                                                                                                                            <span className="ml-2">{subchilditem.Shareweb_x0020_ID}</span>
                                                                                                                                        </div>
                                                                                                                                        </td>
                                                                                                                                        <td style={{ width: "23%" }}>
                                                                                                                                            {subchilditem.siteType == "Master Tasks" && <a className="hreflink serviceColor_Active" target='_blank' data-interception="off"
                                                                                                                                                href={GlobalConstants.MAIN_SITE_URL + "/SP/SitePages/Portfolio-Profile.aspx?taskId=" + childitem.Id}
                                                                                                                                            >
                                                                                                                                                <span dangerouslySetInnerHTML={{ __html: subchilditem?.TitleNew }}></span>

                                                                                                                                            </a>}
                                                                                                                                            {subchilditem.siteType != "Master Tasks" && <a className="hreflink serviceColor_Active" target='_blank' data-interception="off"
                                                                                                                                                href={GlobalConstants.MAIN_SITE_URL + "/SP/SitePages/Task-Profile.aspx?taskId=" + subchilditem.Id + '&Site=' + subchilditem.siteType}
                                                                                                                                            >  <span dangerouslySetInnerHTML={{ __html: subchilditem?.TitleNew }}></span>

                                                                                                                                            </a>}
                                                                                                                                            {subchilditem.childs != undefined && subchilditem.childs.length > 0 &&
                                                                                                                                                <span className='ms-1'>({subchilditem.childs.length})</span>
                                                                                                                                            }
                                                                                                                                            {subchilditem.Short_x0020_Description_x0020_On != null &&
                                                                                                                                                // <span className="project-tool"><img
                                                                                                                                                //     src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/infoIcon.png" /><span className="tooltipte">
                                                                                                                                                //         <span className="tooltiptext">
                                                                                                                                                //             <div className="tooltip_Desc">
                                                                                                                                                //                 <span>{subchilditem.Short_x0020_Description_x0020_On}</span>
                                                                                                                                                //             </div>
                                                                                                                                                //         </span>
                                                                                                                                                //     </span>
                                                                                                                                                // </span>
                                                                                                                                                <div className='popover__wrapper ms-1' data-bs-toggle="tooltip" data-bs-placement="auto">
                                                                                                                                                    <img src={GlobalConstants.MAIN_SITE_URL + "/SP/SiteCollectionImages/ICONS/24/infoIcon.png"} />
                                                                                                                                                    <div className="popover__content">
                                                                                                                                                        {subchilditem.Short_x0020_Description_x0020_On}
                                                                                                                                                    </div>
                                                                                                                                                </div>
                                                                                                                                            }
                                                                                                                                        </td>
                                                                                                                                        <td style={{ width: "7%" }}>
                                                                                                                                            <div>
                                                                                                                                                {subchilditem.ClientCategory != undefined && subchilditem.ClientCategory.length > 0 && subchilditem.ClientCategory.map(function (client: { Title: string; }) {
                                                                                                                                                    return (
                                                                                                                                                        <span className="ClientCategory-Usericon"
                                                                                                                                                            title={client.Title}>
                                                                                                                                                            <a>{client.Title.slice(0, 2).toUpperCase()}</a>
                                                                                                                                                        </span>
                                                                                                                                                    )
                                                                                                                                                })}</div>
                                                                                                                                        </td>
                                                                                                                                        <td style={{ width: "4%" }}>{subchilditem.PercentComplete}</td>
                                                                                                                                        <td style={{ width: "7%" }}>{subchilditem.ItemRank}</td>
                                                                                                                                        <td style={{ width: "10%" }}>
                                                                                                                                            <div>
                                                                                                                                                <ShowTaskTeamMembers props={subchilditem} TaskUsers={AllUsers}></ShowTaskTeamMembers>
                                                                                                                                            </div>
                                                                                                                                        </td>

                                                                                                                                        <td style={{ width: "9%" }}>{subchilditem.DueDate}</td>
                                                                                                                                        <td style={{ width: "11%" }}>
                                                                                                                                            {subchilditem.Created != null ? Moment(subchilditem.Created).format('DD/MM/YYYY') : ""}
                                                                                                                                            {subchilditem.Author != undefined ?
                                                                                                                                                <img className='AssignUserPhoto' title={subchilditem.Author.Title} src={findUserByName(subchilditem.Author.Title)} />
                                                                                                                                                : <img className='AssignUserPhoto' src="https://hhhhteams.sharepoint.com/sites/HHHH/PublishingImages/Portraits/icon_user.jpg" />}


                                                                                                                                        </td>

                                                                                                                                        <td style={{ width: "7%" }}>
                                                                                                                                            {/* {subchilditem.Item_x0020_Type == 'Task' &&
                                                                                                                                            <>
                                                                                                                                                 {smartTime.toFixed(1)}
                                                                                                                                                 </>
                                                                                                                                                 }
                                                                                                                                                  {SmartTimes? <SmartTimeTotal props={subchilditem} CallBackSumSmartTime={CallBackSumSmartTime} /> : null} */}
                                                                                                                                        </td>


                                                                                                                                        <td style={{ width: "3%" }}>{subchilditem.Item_x0020_Type == 'Task' && subchilditem.siteType != "Master Tasks" && <a onClick={(e) => EditData(e, subchilditem)}><img style={{ width: "22px" }} src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/clock-gray.png"></img></a>}</td>
                                                                                                                                        <td style={{ width: "3%" }}><a>{subchilditem.siteType == "Master Tasks" && <img src="https://hhhhteams.sharepoint.com/_layouts/images/edititem.gif" onClick={(e) => EditComponentPopup(subchilditem)} />}
                                                                                                                                            {subchilditem.Item_x0020_Type == 'Task' && subchilditem.siteType != "Master Tasks" && <img src="https://hhhhteams.sharepoint.com/_layouts/images/edititem.gif" onClick={(e) => EditItemTaskPopup(subchilditem)} />}</a></td>
                                                                                                                                    </tr>
                                                                                                                                </table>
                                                                                                                            </td>
                                                                                                                        </tr>
                                                                                                                        {subchilditem.show && subchilditem.childs.length > 0 && (
                                                                                                                            <>
                                                                                                                                {subchilditem.childs.map(function (nextsubchilditem: any) {
                                                                                                                                    return (
                                                                                                                                        <>
                                                                                                                                            <tr >
                                                                                                                                                <td className="p-0" colSpan={13}>
                                                                                                                                                    <table className="table m-0" style={{ width: "100%" }}>
                                                                                                                                                        <tr className="for-c02">
                                                                                                                                                            <td style={{ width: "2%" }}>
                                                                                                                                                                <div className="accordian-header" onClick={() => handleOpen(nextsubchilditem)}>
                                                                                                                                                                    {nextsubchilditem.childs.length > 0 &&
                                                                                                                                                                        <a className='hreflink'
                                                                                                                                                                            title="Tap to expand the childs">
                                                                                                                                                                            <div className="sign">{nextsubchilditem.childs.length > 0 && nextsubchilditem.show ? <img src={nextsubchilditem.downArrowIcon} />
                                                                                                                                                                                : <img src={nextsubchilditem.RightArrowIcon} />}
                                                                                                                                                                            </div>
                                                                                                                                                                        </a>
                                                                                                                                                                    }
                                                                                                                                                                </div>
                                                                                                                                                            </td>
                                                                                                                                                            <td style={{ width: "6%" }}>
                                                                                                                                                                <span className='pe-2'><input type="checkbox" onChange={(e) => onChangeHandler(nextsubchilditem, item, e)} /></span>
                                                                                                                                                                <span>
                                                                                                                                                                    <a className="hreflink" title="Show All Child" data-toggle="modal">
                                                                                                                                                                        <img className="icon-sites-img ml20" src={nextsubchilditem.SiteIcon}></img>
                                                                                                                                                                    </a>
                                                                                                                                                                </span>
                                                                                                                                                            </td>
                                                                                                                                                            <td style={{ width: "7%" }}>  <div className="d-flex">

                                                                                                                                                                <span className="ml-2">{nextsubchilditem.Shareweb_x0020_ID}</span>
                                                                                                                                                            </div>
                                                                                                                                                            </td>
                                                                                                                                                            <td style={{ width: "23%" }}>
                                                                                                                                                                {nextsubchilditem.siteType == "Master Tasks" && <a className="hreflink serviceColor_Active" target='_blank' data-interception="off"
                                                                                                                                                                    href={GlobalConstants.MAIN_SITE_URL + "/SP/SitePages/Portfolio-Profile.aspx?taskId=" + childitem.Id}
                                                                                                                                                                >  <span dangerouslySetInnerHTML={{ __html: nextsubchilditem?.TitleNew }}></span>

                                                                                                                                                                </a>}
                                                                                                                                                                {nextsubchilditem.siteType != "Master Tasks" && <a className="hreflink serviceColor_Active" target='_blank' data-interception="off"
                                                                                                                                                                    href={GlobalConstants.MAIN_SITE_URL + "/SP/SitePages/Task-Profile.aspx?taskId=" + nextsubchilditem.Id + '&Site=' + nextsubchilditem.siteType}
                                                                                                                                                                > <span dangerouslySetInnerHTML={{ __html: nextsubchilditem?.TitleNew }}></span>

                                                                                                                                                                </a>}
                                                                                                                                                                {nextsubchilditem.childs != undefined && nextsubchilditem.childs.length > 0 &&
                                                                                                                                                                    <span className='ms-1'>({nextsubchilditem.childs.length})</span>
                                                                                                                                                                }
                                                                                                                                                                {nextsubchilditem.Short_x0020_Description_x0020_On != null &&
                                                                                                                                                                    // <span className="project-tool"><img
                                                                                                                                                                    //     src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/infoIcon.png" /><span className="tooltipte">
                                                                                                                                                                    //         <span className="tooltiptext">
                                                                                                                                                                    //             <div className="tooltip_Desc">
                                                                                                                                                                    //                 <span>{nextsubchilditem.Short_x0020_Description_x0020_On}</span>
                                                                                                                                                                    //             </div>
                                                                                                                                                                    //         </span>
                                                                                                                                                                    //     </span>
                                                                                                                                                                    // </span>
                                                                                                                                                                    <div className='popover__wrapper ms-1' data-bs-toggle="tooltip" data-bs-placement="auto">
                                                                                                                                                                        <img src={GlobalConstants.MAIN_SITE_URL + "/SP/SiteCollectionImages/ICONS/24/infoIcon.png"} />
                                                                                                                                                                        <div className="popover__content">
                                                                                                                                                                            {nextsubchilditem.Short_x0020_Description_x0020_On}
                                                                                                                                                                        </div>
                                                                                                                                                                    </div>
                                                                                                                                                                }
                                                                                                                                                            </td>
                                                                                                                                                            <td style={{ width: "7%" }}>
                                                                                                                                                                <div>
                                                                                                                                                                    {nextsubchilditem.ClientCategory != undefined && nextsubchilditem.ClientCategory.length > 0 && nextsubchilditem.ClientCategory.map(function (client: { Title: string; }) {
                                                                                                                                                                        return (
                                                                                                                                                                            <span className="ClientCategory-Usericon"
                                                                                                                                                                                title={client.Title}>
                                                                                                                                                                                <a>{client.Title.slice(0, 2).toUpperCase()}</a>
                                                                                                                                                                            </span>
                                                                                                                                                                        )
                                                                                                                                                                    })}</div>
                                                                                                                                                            </td>
                                                                                                                                                            <td style={{ width: "4%" }}>{nextsubchilditem.PercentComplete}</td>
                                                                                                                                                            <td style={{ width: "7%" }}>{nextsubchilditem.ItemRank}</td>
                                                                                                                                                            <td style={{ width: "10%" }}>
                                                                                                                                                                <div>
                                                                                                                                                                    <ShowTaskTeamMembers props={nextsubchilditem} TaskUsers={AllUsers}></ShowTaskTeamMembers>
                                                                                                                                                                </div>
                                                                                                                                                            </td>

                                                                                                                                                            <td style={{ width: "9%" }}>{nextsubchilditem.DueDate}</td>
                                                                                                                                                            <td style={{ width: "11%" }}>
                                                                                                                                                                {nextsubchilditem.Created != null ? Moment(nextsubchilditem.Created).format('DD/MM/YYYY') : ""}
                                                                                                                                                                {nextsubchilditem.Author != undefined ?
                                                                                                                                                                    <img className='AssignUserPhoto' title={nextsubchilditem.Author.Title} src={findUserByName(nextsubchilditem.Author.Title)} />
                                                                                                                                                                    : <img className='AssignUserPhoto' src="https://hhhhteams.sharepoint.com/sites/HHHH/PublishingImages/Portraits/icon_user.jpg" />}

                                                                                                                                                            </td>

                                                                                                                                                            <td style={{ width: "7%" }}>
                                                                                                                                                                {/* {nextsubchilditem.Item_x0020_Type == 'Task' &&
                                                                                                                                                                    <div>{nextsubchilditem.Mileage}</div>
                                                                                                                                                                } */}
                                                                                                                                                            </td>

                                                                                                                                                            <td style={{ width: "3%" }}>{nextsubchilditem.Item_x0020_Type == 'Task' && nextsubchilditem.siteType != "Master Tasks" && <a onClick={(e) => EditData(e, nextsubchilditem)}><img style={{ width: "22px" }} src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/clock-gray.png"></img></a>}</td>
                                                                                                                                                            <td style={{ width: "3%" }}><a>{nextsubchilditem.siteType == "Master Tasks" && <img src="https://hhhhteams.sharepoint.com/_layouts/images/edititem.gif" onClick={(e) => EditComponentPopup(nextsubchilditem)} />}
                                                                                                                                                                {nextsubchilditem.Item_x0020_Type == 'Task' && nextsubchilditem.siteType != "Master Tasks" && <img src="https://hhhhteams.sharepoint.com/_layouts/images/edititem.gif" onClick={(e) => EditItemTaskPopup(nextsubchilditem)} />}</a></td>
                                                                                                                                                        </tr>
                                                                                                                                                    </table>
                                                                                                                                                </td>
                                                                                                                                            </tr>
                                                                                                                                        </>
                                                                                                                                    )
                                                                                                                                })}
                                                                                                                            </>

                                                                                                                        )}
                                                                                                                    </>
                                                                                                                )
                                                                                                            })}
                                                                                                        </>
                                                                                                    )}
                                                                                                </>
                                                                                            )
                                                                                        }
                                                                                    })}</>
                                                                            )}</>
                                                                    )
                                                                }
                                                            })}
                                                        </>
                                                    )}
                                                </>
                                            )
                                        }
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            {IsTask && <EditTaskPopup Items={SharewebTask} Call={Call}></EditTaskPopup>}
            {IsComponent && <EditInstituton props={SharewebComponent} Call={Call}></EditInstituton>}
            {IsTimeEntry && <TimeEntryPopup props={SharewebTimeComponent} CallBackTimeEntry={TimeEntryCallBack}></TimeEntryPopup>}
            {/* {popupStatus ? <EditInstitution props={itemData} /> : null} */}
            {MeetingPopup && <CreateActivity props={MeetingItems[0]} Call={Call} LoadAllSiteTasks={LoadAllSiteTasks}></CreateActivity>}
            {WSPopup && <CreateWS props={MeetingItems[0]} Call={Call} data={data}></CreateWS>}

            <Panel headerText={` Create Component `} type={PanelType.medium} isOpen={addModalOpen} isBlocking={false} onDismiss={CloseCall}>
                <PortfolioStructureCreationCard CreatOpen={CreateOpenCall} Close={CloseCall} PortfolioType={IsUpdated} SelectedItem={checkedList != null && checkedList.length > 0 ? checkedList[0] : props} />
            </Panel>
            <Panel
                onRenderHeader={onRenderCustomHeaderMain}
                type={PanelType.custom}
                customWidth="600px"
                isOpen={ActivityPopup}
                onDismiss={closeTaskStatusUpdatePoup2}
                isBlocking={false}
            >




                {/* <div className="modal-header  mt-1 px-3">
                            <h5 className="modal-title" id="exampleModalLabel"> Select Client Category</h5>
                            <button onClick={closeTaskStatusUpdatePoup2} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div> */}



                <div className="modal-body bg-f5f5 clearfix">
                    <div className={props?.Portfolio_x0020_Type == 'Events Portfolio' ? 'app component clearfix eventpannelorange' : (props?.Portfolio_x0020_Type == 'Service' ? 'app component clearfix serviepannelgreena' : 'app component clearfix')}>
                        <div id="portfolio" className="section-event pt-0">

                            {/* {
                                    
                                    MeetingItems.SharewebTaskType == undefined  &&
                                        <ul className="quick-actions">

                                            <li className="mx-1 p-2 position-relative bg-siteColor text-center mb-2">
                                                <div onClick={(e) => CreateMeetingPopups('Implementation')}>
                                                    <span className="icon-sites">
                                                        <img className="icon-sites"
                                                            src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/Implementation.png" />

                                                    </span>
                                                    Implmentation
                                                </div>
                                            </li>
                                            <li className="mx-1 p-2 position-relative bg-siteColor text-center mb-2">
                                                <div onClick={() => CreateMeetingPopups('Development')}>
                                                    <span className="icon-sites">
                                                        <img className="icon-sites"
                                                            src="	https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/development.png" />

                                                    </span>
                                                    Development
                                                </div>
                                            </li>
                                            <li className="mx-1 p-2 position-relative bg-siteColor text-center mb-2">
                                                <div onClick={() => CreateMeetingPopups('Activities')}>
                                                    <span className="icon-sites">
                                                    </span>
                                                    Activity
                                                </div>
                                            </li>
                                        </ul>
                                         
                                    } */}
                            {
                                (props != undefined && props.Portfolio_x0020_Type == 'Service') ?
                                    <ul className="quick-actions">

                                        <li className="mx-1 p-2 position-relative bg-siteColor text-center mb-2">
                                            <div onClick={(e) => CreateMeetingPopups('Task')}>
                                                <span className="icon-sites">
                                                    <img className="icon-sites"
                                                        src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/bug.png" />

                                                </span>
                                                Bug
                                            </div>
                                        </li>
                                        <li className="mx-1 p-2 position-relative bg-siteColor text-center mb-2">
                                            <div onClick={() => CreateMeetingPopups('Task')}>
                                                <span className="icon-sites">
                                                    <img className="icon-sites"
                                                        src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/feedbck.png" />

                                                </span>
                                                Feedback
                                            </div>
                                        </li>
                                        <li className="mx-1 p-2 position-relative bg-siteColor text-center mb-2">
                                            <div onClick={() => CreateMeetingPopups('Task')}>
                                                <span className="icon-sites">
                                                    <img src="	https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/Impovement.png" />
                                                </span>
                                                Improvement
                                            </div>
                                        </li>
                                        <li className="mx-1 p-2 position-relative bg-siteColor text-center mb-2">
                                            <div onClick={() => CreateMeetingPopups('Task')}>
                                                <span className="icon-sites">
                                                    <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/design.png" />
                                                </span>
                                                Design
                                            </div>
                                        </li>
                                        <li className="mx-1 p-2 position-relative bg-siteColor text-center mb-2">
                                            <div onClick={() => CreateMeetingPopups('Activities')}>
                                                <span className="icon-sites">
                                                </span>
                                                Activities
                                            </div>
                                        </li>
                                        <li className="mx-1 p-2 position-relative bg-siteColor text-center mb-2">
                                            <div onClick={() => CreateMeetingPopups('Task')}>
                                                <span className="icon-sites">
                                                </span>
                                                Task
                                            </div>
                                        </li>
                                    </ul> :
                                    <ul className="quick-actions">

                                        <li className="mx-1 p-2 position-relative bg-siteColor text-center mb-2">
                                            <div onClick={(e) => CreateMeetingPopups('Implementation')}>
                                                <span className="icon-sites">
                                                    <img className="icon-sites"
                                                        src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/Implementation.png" />

                                                </span>
                                                Implmentation
                                            </div>
                                        </li>
                                        <li className="mx-1 p-2 position-relative bg-siteColor text-center mb-2">
                                            <div onClick={() => CreateMeetingPopups('Development')}>
                                                <span className="icon-sites">
                                                    <img className="icon-sites"
                                                        src="	https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/development.png" />

                                                </span>
                                                Development
                                            </div>
                                        </li>
                                        <li className="mx-1 p-2 position-relative bg-siteColor text-center mb-2">
                                            <div onClick={() => CreateMeetingPopups('Activities')}>
                                                <span className="icon-sites">
                                                </span>
                                                Activity
                                            </div>
                                        </li>
                                    </ul>

                            }
                        </div>
                    </div>
                    <button type="button" className="btn btn-default btn-default ms-1 pull-right" onClick={closeTaskStatusUpdatePoup2}>Cancel</button>
                </div>




            </Panel >

        </div>
    );
}



