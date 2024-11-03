package com.fanglin.construction.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.construction.dao.ConstructerRecordDao;
import com.fanglin.construction.dao.ConstructionDao;
import com.fanglin.construction.dao.ConstructionScheduleDao;
import com.fanglin.construction.po.ConstructerRecordPO;
import com.fanglin.construction.po.ConstructionPO;
import com.fanglin.construction.po.ConstructionSchedulePO;
import com.fanglin.construction.service.ConstructerRecordService;
import com.fanglin.construction.vo.ConstructerRecordVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("constructerRecordService")
@Transactional(readOnly = true)
public class ConstructerRecordServiceImpl implements ConstructerRecordService {

	@Autowired
	private ConstructerRecordDao constructerRecordDao;

	@Autowired
	private ConstructionDao constructionDao;

	@Autowired
	private ConstructionScheduleDao constructionScheduleDao;

	@Override
	public void pageConstructerRecord(Paging paging, List<Filter> filters, Integer company) throws FLException {

		List<ConstructerRecordPO> constructerRecordPOs = constructerRecordDao.pageConstructerRecord(paging, filters, company);
		List<ConstructerRecordVO> constructerRecordVOs = new ArrayList<ConstructerRecordVO>();

		ConstructerRecordVO constructerRecordVO = null;

		for (ConstructerRecordPO constructerRecordPO : constructerRecordPOs) {

			constructerRecordVO = new ConstructerRecordVO();

			BeanUtil.copyProperties(constructerRecordPO, constructerRecordVO);

			constructerRecordVOs.add(constructerRecordVO);
		}

		paging.setData(constructerRecordVOs);
	}

	@Override
	public List<ConstructerRecordVO> queryConstructerRecord(ConstructerRecordVO constructerRecordVO) {

		List<ConstructerRecordPO> constructerRecordPOs = constructerRecordDao.queryConstructerRecord(constructerRecordVO.getCid());
		List<ConstructerRecordVO> constructerRecordVOs = new ArrayList<ConstructerRecordVO>();

		for (ConstructerRecordPO constructerRecordPO : constructerRecordPOs) {

			constructerRecordVO = new ConstructerRecordVO();

			BeanUtil.copyProperties(constructerRecordPO, constructerRecordVO);

			constructerRecordVOs.add(constructerRecordVO);
		}

		return constructerRecordVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addConstructerRecord(ConstructerRecordVO constructerRecordVO) throws FLException {

		ConstructionPO constructionPO = constructionDao.queryConstructionByCid(constructerRecordVO.getCid());

		if (constructionPO == null) {
			throw new FLException(120020, "工程信息不存在");
		}

		ConstructionSchedulePO constructionSchedulePO = constructionScheduleDao.queryConstructionSchedule(constructionPO.getDecoration().getOrderId(), constructerRecordVO.getCnid());

		if (constructionSchedulePO == null) {
			throw new FLException(120024, "工程环节不存在");
		}

		ConstructerRecordPO constructerRecordPO = new ConstructerRecordPO();

		BeanUtil.copyPropertie(constructerRecordVO, constructerRecordPO);

		constructerRecordPO.setCid(constructionPO.getCid());
		constructerRecordPO.setOrderId(constructionPO.getDecoration().getOrderId());
		constructerRecordPO.setCnid(constructionSchedulePO.getCnid());
		constructerRecordPO.setSchedule(constructionSchedulePO.getSchedule());

		constructerRecordPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));

		constructerRecordDao.save(constructerRecordPO);
	}
}
