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
import com.fanglin.core.vo.Authentication;
import com.fanglin.core.vo.Filter;
import com.fanglin.information.dao.NoticeDao;
import com.fanglin.information.dao.NoticeDepartmentDao;
import com.fanglin.information.po.NoticeDepartmentPO;
import com.fanglin.information.po.NoticePO;
import com.fanglin.information.service.NoticeService;
import com.fanglin.information.vo.NoticeVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("noticeService")
@Transactional(readOnly = true)
public class NoticeServiceImpl implements NoticeService{
	
	@Autowired
	private NoticeDepartmentDao noticeDepartmentDao;
	
    @Autowired
    private NoticeDao noticeDao;

    @Autowired
    private UserDao userDao;
    
    @Override
    public void pageNotice(Paging paging, List<Filter> filters, Authentication authentication){

        List<NoticeVO> noticeVOs = new ArrayList<NoticeVO>();
        
        List<NoticePO> noticePOs = noticeDao.pageNotice(paging, filters, authentication.getUserId(), authentication.getCompany());
        
		for(NoticePO noticePO: noticePOs){
            noticeVOs.add(convertBean(noticePO));
        }
        
        paging.setData(noticeVOs);
    }
    
    @Override
    public NoticeVO queryNoticeByNid(NoticeVO noticeVO) throws FLException{
    	
        NoticePO noticePO = noticeDao.get(noticeVO.getNid());
        
        if(noticePO == null){
			throw new FLException(160017, "公告不存在");
		}
        
        if(noticePO != null){
            noticeVO = convertBean(noticePO);
        }

        return noticeVO;
    }
    
    @Override
    public void pageNoticeForSeenByType(Paging paging,NoticeVO noticeVO, Authentication authentication) throws FLException{
    	
    	UserPO userPO = userDao.queryUserByUserId(authentication.getUserId());
    	
    	if(userPO == null){
    		throw new FLException(190005, "人员不存在");
    	}
    	
    	List<NoticeDepartmentPO> noticeDepartmentPOs = noticeDepartmentDao.queryNoticeDepartmentByDid(userPO.getDept().getDid());
    	List<Long> nids = new ArrayList<Long>();
    	
    	for(NoticeDepartmentPO noticeDepartmentPO: noticeDepartmentPOs){
    		nids.add(noticeDepartmentPO.getNid());
    	}
    	
    	List<NoticePO> noticePOs = noticeDao.pageNoticeForSeenByType(paging, nids, noticeVO.getType(), authentication.getCompany());
    	List<NoticeVO> noticeVOs = new ArrayList<NoticeVO>();

		for(NoticePO noticePO: noticePOs){
			noticeVOs.add(convertBean(noticePO));
		}
		
		paging.setData(noticeVOs);
    }
    
    @Override
    @Transactional(rollbackFor=Exception.class)
	public int addNotice(NoticeVO noticeVO, Authentication authentication) throws FLException {
    	
    	UserPO userPO = userDao.queryUserByUserId(authentication.getUserId());
    	
    	if(userPO == null){
    		throw new FLException(190005, "人员不存在");
    	}
    	
		NoticePO noticePO = new NoticePO();
		
		BeanUtil.copyProperties(noticeVO, noticePO, Arrays.asList("user", "dept"));
		
		noticePO.setUser(userPO);
		
		noticePO.setPublishTime(DateUtil.current("yyyy-MM-dd"));
		noticePO.setCompany(authentication.getCompany());
		
		noticeDao.save(noticePO);	
		
		return 0;
	}

    @Override
    @Transactional(rollbackFor=Exception.class)
	public int updateNotice(NoticeVO noticeVO) throws FLException {
    	
    	long nid = noticeVO.getNid();
    	
    	NoticePO noticePO = noticeDao.get(nid);
    	
    	if(noticePO == null){
			throw new FLException(160017, "公告不存在");
		}
    	
    	UserPO userPO = userDao.queryUserByUserId(noticeVO.getUser().getUserId());
    	
    	if(userPO == null){
    		throw new FLException(190005, "人员不存在");
    	}
     	
    	BeanUtil.copyProperties(noticeVO, noticePO, Arrays.asList("user", "dept"));
    	
    	noticePO.setUser(userPO);
    	
		noticeDao.update(noticePO);
		
		return 0;
	}

    @Override
    @Transactional(rollbackFor=Exception.class)
    public int deleteNotice(NoticeVO noticeVO) throws FLException{
    	
    	long nid = noticeVO.getNid();
    	
    	NoticePO notice = noticeDao.get(nid);
		
		if(notice ==  null){
			throw new FLException(160017, "公告不存在");
		}
		
		noticeDao.delete(notice);
    	noticeDepartmentDao.deleteNoticeDepartment(nid);
		
    	return 0;
    }
    
    private NoticeVO convertBean(NoticePO noticePO){
    	
        NoticeVO noticeVO = new NoticeVO();
        
        BeanUtil.copyProperties(noticePO, noticeVO, Arrays.asList("user", "dept"));
        
        noticeVO.setUser(new UserVO().setBaseInfo(noticePO.getUser()));
        
        return noticeVO;
    }
    
}
