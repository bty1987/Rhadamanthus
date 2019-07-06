/**
 * @File Name		: MeasurementUnitServiceImpl.java
 * @Package   	: com.fanglin.service.impl
 * @Version		: 1.0
 * @Date			: 2014-7-29
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.communion.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.dao.MeasurementUnitDao;
import com.fanglin.communion.po.MeasurementUnitPO;
import com.fanglin.communion.service.MeasurementUnitService;
import com.fanglin.communion.vo.MeasurementUnitVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("measurementUnitService")
@Transactional(readOnly = true)
public class MeasurementUnitServiceImpl implements MeasurementUnitService {

	@Autowired
	private MeasurementUnitDao measurementUnitDao;

	@Override
	public List<MeasurementUnitVO> pageMeasurementUnit(Paging paging, List<Filter> filters) {

		List<MeasurementUnitPO> measurementUnitPOs = measurementUnitDao.pageMeasurementUnit(paging, filters);

		List<MeasurementUnitVO> measurementUnitVOs = new ArrayList<MeasurementUnitVO>();

		for (MeasurementUnitPO measurementUnitPO : measurementUnitPOs) {

			MeasurementUnitVO measurementUnitVO = new MeasurementUnitVO();

			BeanUtil.copyProperties(measurementUnitPO, measurementUnitVO);

			measurementUnitVOs.add(measurementUnitVO);
		}
		paging.setData(measurementUnitVOs);

		return measurementUnitVOs;
	}

	@Override
	public List<MeasurementUnitVO> queryMeasurementUnit() {

		List<MeasurementUnitPO> measurementUnitPOs = measurementUnitDao.list();

		List<MeasurementUnitVO> measurementUnitVOs = new ArrayList<MeasurementUnitVO>();

		for (MeasurementUnitPO measurementUnitPO : measurementUnitPOs) {

			MeasurementUnitVO measurementUnitVO = new MeasurementUnitVO();

			BeanUtil.copyProperties(measurementUnitPO, measurementUnitVO);

			measurementUnitVOs.add(measurementUnitVO);
		}
		return measurementUnitVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addMeasurementUnit(MeasurementUnitVO measurementUnitVO) throws FLException {

		MeasurementUnitPO measurementUnitPOs = measurementUnitDao.queryMeasurementUnitByName(measurementUnitVO.getName());

		if (measurementUnitPOs != null) {
			throw new FLException(130010, "单位已存在");
		}

		MeasurementUnitPO measurementUnitPO = new MeasurementUnitPO();

		measurementUnitPO.setName(measurementUnitVO.getName());

		measurementUnitPO.setUnitDes(measurementUnitVO.getUnitDes());

		measurementUnitDao.save(measurementUnitPO);

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateMeasurementUnit(MeasurementUnitVO measurementUnitVO) throws FLException {

		MeasurementUnitPO measurementUnitPOs = measurementUnitDao.queryMeasurementUnitById(measurementUnitVO.getId());

		if (measurementUnitPOs == null) {
			throw new FLException(130011, "单位不存在");
		}

		measurementUnitPOs.setName(measurementUnitVO.getName());

		measurementUnitPOs.setUnitDes(measurementUnitVO.getUnitDes());

		measurementUnitDao.update(measurementUnitPOs);
	}

}
