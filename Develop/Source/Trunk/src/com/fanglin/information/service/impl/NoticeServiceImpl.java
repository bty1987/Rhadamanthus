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

import com.fanglin.core.vo.FilterVO;
import com.fanglin.department.dao.DepartmentDao;
import com.fanglin.department.po.DepartmentPO;
import com.fanglin.department.vo.DepartmentVO;
import com.fanglin.information.dao.NoticeDao;
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
    public NoticeDao noticeDao;

    @Autowired
    public UserDao userDao;

    @Autowired
    public DepartmentDao departmentDao;
    
    @Override
    public void pageNotice(Paging paging, List<FilterVO> filters, String userId){
    	
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
    		UserPO userPO = userDao.get(userId);
    		
    		if(!userPO.getRole().getRoleId().equals(RolePO.SUPER_ROLEID_STR)){
                if(userPO.getDept().getFatherDept() != null){
                    deptIds.add(userPO.getDept().getDeptId());
                    deptIds.add(userPO.getDept().getFatherDept().getDeptId());
                }else{
                    deptIds = departmentDao.queryDepartmentForChildren(userPO.getDept().getDeptId());
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
        
        if(noticeVO.getNoticeId() != null){
        	noticePO = noticeDao.get(noticeVO.getNoticeId());
        }else{
        	UserPO user = userDao.get(noticeVO.getUser().getUserId());
        	String deptId = user.getDept().getDeptId();
        	DepartmentVO dept = new DepartmentVO();
        	dept.setDeptId(deptId);
        	noticeVO.setDept(dept);
        }
        
        BeanUtil.copyProperties(noticeVO, noticePO, Arrays.asList("user", "dept"));
        
        noticePO.setUser(new UserPO());
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
        
        noticeVO.setUser(new UserVO());
        noticeVO.setDept(new DepartmentVO());
        
        BeanUtil.copyProperties(noticePO.getUser(), noticeVO.getUser(), Arrays.asList("role", "dept"));
        BeanUtil.copyProperties(noticePO.getDept(), noticeVO.getDept(), Arrays.asList("fatherDept", "cityProper"));
        
        return noticeVO;
    }

}
