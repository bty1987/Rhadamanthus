package com.fanglin.customer.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.customer.dao.BackgroundDao;
import com.fanglin.customer.po.BackgroundPO;
import com.fanglin.customer.service.BackgroundService;
import com.fanglin.customer.vo.BackgroundVO;
import com.fanglin.utils.BeanUtil;

@Service("backgroundService")
@Transactional(readOnly = true)
public class BackgroundServiceImpl implements BackgroundService {

	@Autowired
	private BackgroundDao backgroundDao;

	@Override
	public BackgroundVO queryBackground(BackgroundVO backgroundVO) {

		BackgroundPO backgroundPO = backgroundDao.queryBackgroundByUnionId(backgroundVO.getUnionId());

		backgroundVO = new BackgroundVO();

		BeanUtil.copyPropertie(backgroundPO, backgroundVO);

		return backgroundVO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateBackground(BackgroundVO backgroundVO) throws FLException {

		BackgroundPO backgroundPO = backgroundDao.queryBackgroundByUnionId(backgroundVO.getUnionId());

		if (backgroundPO == null) {

			backgroundPO = new BackgroundPO();

			BeanUtil.copyPropertie(backgroundVO, backgroundPO);

			backgroundDao.save(backgroundPO);

		} else {

			backgroundPO.setPath(backgroundVO.getPath());

			backgroundDao.update(backgroundPO);
		}

		return 0;
	}

}
