package com.fanglin.report.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.report.dao.PanoramaMetricDao;
import com.fanglin.report.service.PanoramaMetricService;
import com.fanglin.report.vo.OrderPanoramaVO;

@Service("panoramaMetricService")
@Transactional(readOnly = true)
public class PanoramaMetricServiceImpl implements PanoramaMetricService {

	@Autowired
	private PanoramaMetricDao panoramaMetricDao;

	@Override
	public OrderPanoramaVO queryOrderPanorama(String orderId) throws FLException {

		if (orderId == null || orderId.trim().isEmpty()) {
			throw new FLException(210001, "报表类型错误");
		}

		OrderPanoramaVO vo = panoramaMetricDao.queryOrderPanorama(orderId.trim());

		if (vo == null) {
			throw new FLException(210002, "装修单不存在");
		}

		return vo;
	}

}
