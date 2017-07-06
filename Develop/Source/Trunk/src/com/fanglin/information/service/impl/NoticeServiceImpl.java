/**
 * Title: NoticeServiceImpl
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: BTY
 * @author bty1987
 *
 */

package com.fanglin.information.service.impl;


import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.department.dao.DepartmentDao;
import com.fanglin.department.po.DepartmentPO;
import com.fanglin.department.vo.DepartmentVO;
import com.fanglin.information.dao.NoticeDao;
import com.fanglin.information.dao.NoticeDepartmentDao;
import com.fanglin.information.po.NoticeDepartmentPO;
import com.fanglin.information.po.NoticePO;
import com.fanglin.information.service.NoticeService;
import com.fanglin.information.vo.NoticeVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.system.po.RolePO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("noticeService")
@Transactional(readOnly = true)
public class NoticeServiceImpl implements NoticeService{
	@Autowired
	public NoticeDepartmentDao noticeDepartmentDao;
	
    @Autowired
    public NoticeDao noticeDao;

    @Autowired
    public UserDao userDao;

    @Autowired
    public DepartmentDao departmentDao;
    
    @Override
    public void pageNotice(Paging paging, List<Filter> filters, String userId){

        List<NoticePO> noticePOs = noticeDao.queryPageNotices(paging, filters, userId);
        
        List<NoticeVO> noticeVOs = new ArrayList<NoticeVO>();
        
        for(NoticePO noticePO: noticePOs){
            noticeVOs.add(convertBean(noticePO));
        }
        
        paging.setData(noticeVOs);
    }

    @Override
    public NoticeVO queryNoticeById(Integer id){
        NoticePO noticePO = noticeDao.get(id);
        NoticeVO noticeVO = null;
        
        if(noticePO != null){
            noticeVO = convertBean(noticePO);
        }

        return noticeVO;
    }

    @Override
    public List<NoticeVO> queryNoticeForValid(String type){
        List<NoticePO> noticePOs = noticeDao.queryValidNotices(type);
        List<NoticeVO> noticeVOs = new ArrayList<NoticeVO>();
        
        for(NoticePO noticePO: noticePOs){
            noticeVOs.add(convertBean(noticePO));
        }
        
        return noticeVOs;
    }

    @Override
    public void pageNoticeForDeptAValid(Paging paging, NoticeVO noticeVO, String userId){
    	
    	List<String> deptIds = new ArrayList<String>();
    	
    	if(userId != null){
    		UserPO userPO = userDao.queryUserByUserId(userId);
    		//userPO调用Role的模块(system模块) 如果roleId不等于Role.SUPER_ROLEID_STR (RolePO里的SUPER_ROLEID_STR等于1)
    		if(!userPO.getRole().getRoleId().equals(RolePO.SUPER_ROLEID_STR)){
    			//判断UserPO的Dept的FatherDept不等于空
                if(userPO.getDept().getFatherDept() != null){
                	//往集合里添加DeptId
                    deptIds.add(userPO.getDept().getDeptId());
                    //往集合里添加FatherDept里的DeptId
                    deptIds.add(userPO.getDept().getFatherDept().getDeptId());
                }else{
                	//调用departmentDao里的方法  查询fatherDeptId方法
                    deptIds = departmentDao.queryDepartmentForChildren(userPO.getDept().getDeptId());
                    //添加user里的DeptId
                    deptIds.add(userPO.getDept().getDeptId());
                }
            }
    	}
    	
        List<NoticePO> noticePOs = noticeDao.queryPageDeptValidNotices(paging, deptIds, noticeVO.getType());
        List<NoticeVO> noticeVOs = new ArrayList<NoticeVO>();
        
        for(NoticePO noticePO: noticePOs){
            noticeVOs.add(convertBean(noticePO));
        }

        paging.setData(noticeVOs);
    }

    @Override
    @Transactional(rollbackFor=Exception.class)
    public void saveOrUpdateNotice(NoticeVO noticeVO){
    	
        NoticePO noticePO = new NoticePO();
        //如果主键存在获得NoticeId,否则重新创建
        if(noticeVO.getNoticeId() != null){
        	noticePO = noticeDao.get(noticeVO.getNoticeId());
        }else{
        	UserPO user = userDao.queryUserByUserId(noticeVO.getUser().getUserId());
        	String deptId = user.getDept().getDeptId();
        	DepartmentVO dept = new DepartmentVO();
        	dept.setDeptId(deptId);
        	noticeVO.setDept(dept);
        }
        
        BeanUtil.copyProperties(noticeVO, noticePO, Arrays.asList("user", "dept"));
        
        
        UserPO userPO = new UserPO();
        userPO=userDao.queryUserByUserId(noticeVO.getUser().getUserId());
        
       // String userId=noticeVO.getUser().getUserId();
       // userPO.setUserId(userId);
        
        noticePO.setUser(userPO);
        noticePO.setDept(new DepartmentPO());
        
        BeanUtil.copyProperties(noticeVO.getUser(), noticePO.getUser(), Arrays.asList("role", "dept"));
        BeanUtil.copyProperties(noticeVO.getDept(), noticePO.getDept(), Arrays.asList("fatherDept", "cityProper"));
        
        noticePO.setPublishTime(DateUtil.current("yyyy-MM-dd"));
        
        noticeDao.saveOrUpdate(noticePO);
    }

    @Override
    @Transactional(rollbackFor=Exception.class)
    public void deleteNoticeById(Integer id){
    	
    	noticeDao.deleteById(id);     
    	noticeDepartmentDao.deleteNoticeDepartments(id);
    }

    @Override
    @Transactional(rollbackFor=Exception.class)
    public void deleteNotice(List<Integer> ids){
		
        for(Integer id : ids){
        	
        	deleteNoticeById(id);
        	
        }
    }
    

    private NoticeVO convertBean(NoticePO noticePO){
        NoticeVO noticeVO = new NoticeVO();
        
        BeanUtil.copyProperties(noticePO, noticeVO, Arrays.asList("user", "dept"));
        //先定义userVO和DepartmentVO，用PO获取对象
        //最后用把PO赋给VO，保存对象
        UserVO userVO = new UserVO();
        DepartmentVO departmentVO = new DepartmentVO();
        //获得userPO的对象
        UserPO userPO = noticePO.getUser();
        //获得departmentPO对象
        DepartmentPO departmentPO = noticePO.getDept();
        //userVO获取userPO的属性
        userVO.setUserId(userPO.getUserId());
        //获取name
        userVO.setUserName(userPO.getUserName());
        //获取当前姓名
        userVO.setCurrentName(userPO.getCurrentName());
        //departmentVo获取PO的属性
        departmentVO.setDeptId(departmentPO.getDeptId());
        //获取Name
        departmentVO.setDeptName(departmentPO.getDeptName());
        //保存userVO对象
        noticeVO.setUser(userVO);
        //保存departmentVO对象
        noticeVO.setDept(departmentVO);
        
        return noticeVO;
    }

    //管理公告对部门公开

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void updateNoticeDepartment(List<Integer> dids, NoticeVO notice) throws FLException {
		
		NoticePO notices = noticeDao.get(notice.getNoticeId());
		
		if(notices ==  null){
			throw new FLException(160017, "公告不存在");
		}
		System.out.println(notice.getNoticeId());
		
		List<NoticeDepartmentPO> listNoticeDepartments = noticeDepartmentDao.queryNoticeDepartmentByNoticeId(notice.getNoticeId());
		//System.out.println(listNoticeDepartments+"sdfsd");
		
		for (NoticeDepartmentPO listNoticeDepartment:listNoticeDepartments) {
			noticeDepartmentDao.delete(listNoticeDepartment);
		}
		
		for (Integer did : dids) {
			NoticeDepartmentPO noticeDepartmentPO = new NoticeDepartmentPO();
			
			noticeDepartmentPO.setNotice(notices);
			noticeDepartmentPO.setDid(did);
			
			noticeDepartmentDao.save(noticeDepartmentPO);
		}
		
	}

}
