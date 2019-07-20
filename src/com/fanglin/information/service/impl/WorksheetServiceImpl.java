package com.fanglin.information.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.information.dao.WorksheetDao;
import com.fanglin.information.po.WorksheetPO;
import com.fanglin.information.service.WorksheetService;
import com.fanglin.information.vo.WorksheetVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("worksheetService")
@Transactional(readOnly = true)
public class WorksheetServiceImpl implements WorksheetService {

	@Autowired
	private WorksheetDao worksheetDao;

	@Autowired
	private UserDao userDao;
	
	@Override
	@Transactional(rollbackFor = Exception.class)
	public void pageWorksheet(Paging paging, List<Filter> filters, int company) throws FLException {
		
		List<WorksheetPO> WorksheetPOs = worksheetDao.pageWorksheet(paging, filters, company);
		List<WorksheetVO> WorksheetVOs = new ArrayList<WorksheetVO>();

		for (WorksheetPO worksheetPO : WorksheetPOs) {
			
			WorksheetVO worksheetVO = new WorksheetVO(new UserVO(), new UserVO());

			BeanUtil.copyProperties(worksheetPO, worksheetVO, Arrays.asList("creater", "handler"));
			BeanUtil.copyProperties(worksheetPO.getCreater(), worksheetVO.getCreater(), Arrays.asList("dept", "duty", "role"));
			BeanUtil.copyProperties(worksheetPO.getHandler(), worksheetVO.getHandler(), Arrays.asList("dept", "duty", "role"));

			WorksheetVOs.add(worksheetVO);
		}

		paging.setData(WorksheetVOs);

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addWorksheet(WorksheetVO worksheetVO, String userId, int company) throws FLException {

		UserPO creater = userDao.queryUserByUserId(userId);
		
		WorksheetPO worksheetPO = new WorksheetPO();
		worksheetPO.setCreater(creater);
		worksheetPO.setStatus(WorksheetPO.STATUS_INIT_INT);
		worksheetPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		
		BeanUtil.copyProperties(worksheetVO, worksheetPO, Arrays.asList("creater", "handler"));
		
		worksheetDao.save(worksheetPO);
		
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void cancelWorksheet(WorksheetVO worksheetVO, String userId, int company) throws FLException {
		
		WorksheetPO worksheetPO = worksheetDao.get(worksheetVO.getWsid());
		
		if (worksheetPO == null) {
			throw new FLException(160050, "工单不存在");
		}
		
		if(worksheetPO.getStatus() != WorksheetPO.STATUS_INIT_INT){
			throw new FLException(160051, "工单不可操作");
		}

		UserPO handler = userDao.queryUserByUserId(userId);
		
		worksheetPO.setHandler(handler);
		worksheetPO.setStatus(WorksheetPO.STATUS_CANCEL_INT);
		worksheetPO.setHandTime(DateUtil.getDateToTimestamp(new Date()));
		
		BeanUtil.copyProperties(worksheetVO, worksheetPO, Arrays.asList("creater", "handler"));
		
		worksheetDao.update(worksheetPO);
		
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void handleWorksheet(WorksheetVO worksheetVO, String userId, int company) throws FLException {

		WorksheetPO worksheetPO = worksheetDao.get(worksheetVO.getWsid());
		
		if (worksheetPO == null) {
			throw new FLException(160050, "工单不存在");
		}
		
		if(worksheetPO.getStatus() != WorksheetPO.STATUS_INIT_INT){
			throw new FLException(160051, "工单不可操作");
		}
		
		UserPO handler = userDao.queryUserByUserId(userId);
		
		worksheetPO.setHandler(handler);
		worksheetPO.setStatus(WorksheetPO.STATUS_HANDL_INT);
		worksheetPO.setHandTime(DateUtil.getDateToTimestamp(new Date()));
		
		BeanUtil.copyProperties(worksheetVO, worksheetPO, Arrays.asList("creater", "handler"));
		
		worksheetDao.update(worksheetPO);
		
	}

}
