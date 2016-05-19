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

package com.fanglin.common.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.common.dao.MeasurementUnitDao;
import com.fanglin.common.po.MeasurementUnitPO;
import com.fanglin.common.service.MeasurementUnitService;
import com.fanglin.common.vo.MeasurementUnitVO;
import com.fanglin.utils.BeanUtil;

@Service("measurementUnitService")
@Transactional(readOnly=true)
public class MeasurementUnitServiceImpl implements MeasurementUnitService{
	
	@Autowired
	private MeasurementUnitDao measurementUnitDao;

	@Override
	public List<MeasurementUnitVO> queryMeasurementUnit(){
		
		List<MeasurementUnitPO> measurementUnitPOs = measurementUnitDao.list();
		List<MeasurementUnitVO> measurementUnitVOs = new ArrayList<MeasurementUnitVO>();
		
		for(MeasurementUnitPO measurementUnitPO: measurementUnitPOs){
			MeasurementUnitVO measurementUnitVO = new MeasurementUnitVO();
			BeanUtil.copyProperties(measurementUnitPO, measurementUnitVO);
			measurementUnitVOs.add(measurementUnitVO);
		}
		
		return measurementUnitVOs;
	}

}
