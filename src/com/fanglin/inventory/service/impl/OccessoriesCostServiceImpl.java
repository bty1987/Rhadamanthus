package com.fanglin.inventory.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.inventory.dao.OccessoriesCostDao;
import com.fanglin.inventory.dao.OccessoriesDao;
import com.fanglin.inventory.po.OccessoriesCostPO;
import com.fanglin.inventory.po.OccessoriesPO;
import com.fanglin.inventory.service.OccessoriesCostService;
import com.fanglin.inventory.vo.OccessoriesCostVO;
import com.fanglin.utils.BeanUtil;

@Service("occessoriesCostService")
@Transactional(readOnly = true)
public class OccessoriesCostServiceImpl implements OccessoriesCostService {

	@Autowired
	private OccessoriesCostDao occessoriesCostDao;

	@Autowired
	private OccessoriesDao occessoriesDao;

	@Override
	public List<OccessoriesCostVO> queryOccessoriesCost(OccessoriesCostVO occessoriesCostVO) {

		List<OccessoriesCostPO> occessoriesCostPOs = occessoriesCostDao.queryOccessoriesCost(occessoriesCostVO.getOid());
		List<OccessoriesCostVO> occessoriesCostVOs = new ArrayList<OccessoriesCostVO>();

		for (OccessoriesCostPO occessoriesCostPO : occessoriesCostPOs) {

			occessoriesCostVO = new OccessoriesCostVO();

			BeanUtil.copyProperties(occessoriesCostPO, occessoriesCostVO);

			occessoriesCostVOs.add(occessoriesCostVO);
		}

		return occessoriesCostVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addOccessoriesCost(OccessoriesCostVO occessoriesCostVO) throws FLException {

		OccessoriesPO occessoriesPO = occessoriesDao.get(occessoriesCostVO.getOid());

		if (occessoriesPO == null) {
			throw new FLException(260023, "辅料单不存在");
		}

		OccessoriesCostPO occessoriesCostPO = new OccessoriesCostPO().init(occessoriesCostVO.getOid(), occessoriesCostVO.getPrice(), occessoriesCostVO.getCost(), occessoriesCostVO.getType());

		occessoriesCostDao.save(occessoriesCostPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateOccessoriesCost(OccessoriesCostVO occessoriesCostVO) throws FLException {

		OccessoriesCostPO occessoriesCostPO = occessoriesCostDao.get(occessoriesCostVO.getOcid());

		if (occessoriesCostPO == null) {

		}

		occessoriesCostPO.setPrice(occessoriesCostVO.getPrice());
		occessoriesCostPO.setCost(occessoriesCostVO.getCost());

		occessoriesCostDao.update(occessoriesCostPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteOccessoriesCost(OccessoriesCostVO occessoriesCostVO) throws FLException {

		OccessoriesCostPO occessoriesCostPO = occessoriesCostDao.get(occessoriesCostVO.getOcid());

		occessoriesCostDao.delete(occessoriesCostPO);

		return 0;
	}

}
