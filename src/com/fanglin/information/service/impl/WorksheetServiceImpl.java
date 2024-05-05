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

		List<WorksheetPO> worksheetPOs = worksheetDao.pageWorksheet(paging, filters, company);
		List<WorksheetVO> worksheetVOs = new ArrayList<WorksheetVO>();

		for (WorksheetPO worksheetPO : worksheetPOs) {

			WorksheetVO worksheetVO = new WorksheetVO(new UserVO(), new UserVO());

			BeanUtil.copyProperties(worksheetPO, worksheetVO, Arrays.asList("creater", "handler"));
			BeanUtil.copyProperties(worksheetPO.getCreater(), worksheetVO.getCreater(), Arrays.asList("dept", "duty", "role"));
			BeanUtil.copyProperties(worksheetPO.getHandler(), worksheetVO.getHandler(), Arrays.asList("dept", "duty", "role"));

			worksheetVOs.add(worksheetVO);
		}

		paging.setData(worksheetVOs);
	}

	@Override
	public List<WorksheetVO> queryWorksheet(WorksheetVO worksheet, String userId) {

		List<WorksheetPO> worksheetPOs = worksheetDao.queryWorksheet(userId);
		List<WorksheetVO> worksheetVOs = new ArrayList<WorksheetVO>();

		for (WorksheetPO worksheetPO : worksheetPOs) {

			WorksheetVO worksheetVO = new WorksheetVO(new UserVO(), new UserVO());

			BeanUtil.copyProperties(worksheetPO, worksheetVO, Arrays.asList("creater", "handler"));

			BeanUtil.copyProperties(worksheetPO.getCreater(), worksheetVO.getCreater(), Arrays.asList("dept", "role", "duty"));
			BeanUtil.copyProperties(worksheetPO.getHandler(), worksheetVO.getHandler(), Arrays.asList("dept", "role", "duty"));

			worksheetVOs.add(worksheetVO);

		}

		return worksheetVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addWorksheet(WorksheetVO worksheetVO, String userId, int company) throws FLException {

		WorksheetPO worksheetPO = new WorksheetPO();

		BeanUtil.copyProperties(worksheetVO, worksheetPO, Arrays.asList("creater", "handler"));

		UserPO creater = userDao.queryUserByUserId(userId);

		worksheetPO.setCreater(creater);
		worksheetPO.setStatus(WorksheetPO.STATUS_INIT_INT);
		worksheetPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));

		worksheetDao.save(worksheetPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateWorksheet(WorksheetVO worksheetVO) throws FLException {

		WorksheetPO worksheetPO = worksheetDao.get(worksheetVO.getWsid());

		if (worksheetPO == null) {
			throw new FLException(160050, "工单不存在");
		}

		worksheetPO.setPath(worksheetVO.getPath());

		worksheetDao.update(worksheetPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void cancelWorksheet(WorksheetVO worksheetVO, String userId, int company) throws FLException {

		WorksheetPO worksheetPO = worksheetDao.get(worksheetVO.getWsid());

		if (worksheetPO == null) {
			throw new FLException(160050, "工单不存在");
		}

		if (worksheetPO.getStatus() != WorksheetPO.STATUS_INIT_INT) {
			throw new FLException(160051, "工单不可操作");
		}

		UserPO handler = userDao.queryUserByUserId(userId);

		worksheetPO.setHandler(handler);
		worksheetPO.setStatus(WorksheetPO.STATUS_CANCEL_INT);
		worksheetPO.setHandTime(DateUtil.getDateToTimestamp(new Date()));

		worksheetDao.update(worksheetPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void handleWorksheet(WorksheetVO worksheetVO, String userId, int company) throws FLException {

		WorksheetPO worksheetPO = worksheetDao.get(worksheetVO.getWsid());

		if (worksheetPO == null) {
			throw new FLException(160050, "工单不存在");
		}

		if (worksheetPO.getStatus() != WorksheetPO.STATUS_INIT_INT) {
			throw new FLException(160051, "工单不可操作");
		}

		UserPO handler = userDao.queryUserByUserId(userId);

		worksheetPO.setHandler(handler);
		worksheetPO.setStatus(WorksheetPO.STATUS_HANDL_INT);
		worksheetPO.setHandTime(DateUtil.getDateToTimestamp(new Date()));
		worksheetPO.setResult(worksheetVO.getResult());

		worksheetDao.update(worksheetPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void finishWorksheet(WorksheetVO worksheetVO) throws FLException {

		WorksheetPO worksheetPO = worksheetDao.get(worksheetVO.getWsid());

		if (worksheetPO == null) {
			throw new FLException(160050, "工单不存在");
		}

		if (worksheetPO.getStatus() != WorksheetPO.STATUS_HANDL_INT) {
			throw new FLException(160051, "工单不可操作");
		}

		worksheetPO.setStatus(WorksheetPO.STATUS_FINISH_INT);

		worksheetDao.update(worksheetPO);
	}

}
