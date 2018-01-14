/**
 * @File Name		: NoticeDepartmentServiceImpl.java
 * @Package   	: com.fanglin.information.service.impl
 * @Version		: 1.0
 * @Date			: 2017-7-15
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.information.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.information.dao.NoticeDao;
import com.fanglin.information.dao.NoticeDepartmentDao;
import com.fanglin.information.po.NoticeDepartmentPO;
import com.fanglin.information.po.NoticePO;
import com.fanglin.information.service.NoticeDepartmentService;
import com.fanglin.information.vo.NoticeDepartmentVO;
import com.fanglin.information.vo.NoticeVO;
import com.fanglin.utils.BeanUtil;

@Service("noticeDepartmentService")
@Transactional(readOnly=true)
public class NoticeDepartmentServiceImpl implements NoticeDepartmentService {
	
	@Autowired
	private NoticeDao noticeDao;
	
	@Autowired
	private NoticeDepartmentDao noticeDepartmentDao;

	@Override
	public List<NoticeDepartmentVO> queryNoticeDepartment(NoticeVO noticeVO) throws FLException {
		
		long nid = noticeVO.getNid();
		
		NoticePO noticePO = noticeDao.get(nid);
		
		if(noticePO == null){
			throw new FLException(160017, "公告不存在");
		}
		
		List<NoticeDepartmentPO> noticeDepartmentPOs = noticeDepartmentDao.queryNoticeDepartmentByNid(nid);
		List<NoticeDepartmentVO> noticeDepartmentVOs = new ArrayList<NoticeDepartmentVO>();
		
		NoticeDepartmentVO noticeDepartmentVO;
		
		for(NoticeDepartmentPO noticeDepartmentPO: noticeDepartmentPOs){
			
			noticeDepartmentVO = new NoticeDepartmentVO();
			
			BeanUtil.copyPropertie(noticeDepartmentPO, noticeDepartmentVO);
			
			noticeDepartmentVOs.add(noticeDepartmentVO);
		}
		
		return noticeDepartmentVOs;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateNoticeDepartment(List<Integer> dids, NoticeVO noticeVO) throws FLException {
		
		long nid = noticeVO.getNid();
		
		NoticePO notices = noticeDao.get(nid);
		
		if(notices ==  null){
			throw new FLException(160017, "公告不存在");
		}
		
		noticeDepartmentDao.deleteNoticeDepartment(nid);

		for (Integer did: dids) {
			NoticeDepartmentPO noticeDepartmentPO = new NoticeDepartmentPO(nid, did);
			
			noticeDepartmentDao.save(noticeDepartmentPO);
		}
		
		return 0;
	}

}
