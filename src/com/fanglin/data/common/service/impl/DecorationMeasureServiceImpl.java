package com.fanglin.data.common.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.data.common.dao.DecorationMeasureDao;
import com.fanglin.data.common.service.DecorationMeasureService;
import com.fanglin.data.common.vo.DecorationMeasureVO;
import com.fanglin.data.po.DecorationMeasurePO;
import com.fanglin.utils.BeanUtil;

@Service("decorationMeasureService")
@Transactional(readOnly = true)
public class DecorationMeasureServiceImpl implements DecorationMeasureService {

	@Autowired
	private DecorationMeasureDao decorationMeasureDao;

	@Override
	public List<DecorationMeasureVO> queryDecorationMeasure() {

		List<DecorationMeasurePO> decorationMeasurePOs = decorationMeasureDao.queryDecorationMeasure();
		List<DecorationMeasureVO> decorationMeasureVOs = new ArrayList<DecorationMeasureVO>();

		for (DecorationMeasurePO decorationMeasurePO : decorationMeasurePOs) {

			DecorationMeasureVO decorationMeasureVO = new DecorationMeasureVO();

			BeanUtil.copyProperties(decorationMeasurePO, decorationMeasureVO);

			decorationMeasureVOs.add(decorationMeasureVO);

		}

		return decorationMeasureVOs;
	}

}
