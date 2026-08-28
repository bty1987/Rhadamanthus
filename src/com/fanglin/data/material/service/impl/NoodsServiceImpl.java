package com.fanglin.data.material.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.material.dao.NoodsDao;
import com.fanglin.data.material.service.NoodsService;
import com.fanglin.data.material.vo.NoodsVO;
import com.fanglin.data.po.NoodsPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("noodsService")
@Transactional(readOnly = true)
public class NoodsServiceImpl implements NoodsService {

	@Autowired
	private NoodsDao noodsDao;

	@Override
	public void pageNoods(Paging paging, List<Filter> filters, int company) throws FLException {

		List<NoodsPO> noodsPOs = noodsDao.pageNoods(paging, filters, company);
		List<NoodsVO> noodsVOs = new ArrayList<NoodsVO>();

		NoodsVO noodsVO;

		for (NoodsPO noodsPO : noodsPOs) {

			noodsVO = new NoodsVO();

			BeanUtil.copyProperties(noodsPO, noodsVO);

			noodsVOs.add(noodsVO);
		}

		paging.setData(noodsVOs);
	}

	@Override
	public NoodsVO queryNoods(NoodsVO noodsVO) throws FLException {

		NoodsPO noodsPO = noodsDao.get(noodsVO.getNid());
		noodsVO = new NoodsVO();

		BeanUtil.copyProperties(noodsPO, noodsVO);

		return noodsVO;
	}

	@Override
	public List<NoodsVO> queryNoodsByName(NoodsVO noodsVO, int company) {

		List<NoodsPO> noodsPOs = noodsDao.queryNoodsByName(noodsVO.getName(), 10, company);
		List<NoodsVO> noodsVOs = new ArrayList<NoodsVO>();

		for (NoodsPO noodsPO : noodsPOs) {

			noodsVO = new NoodsVO();

			BeanUtil.copyProperties(noodsPO, noodsVO);

			noodsVOs.add(noodsVO);
		}

		return noodsVOs;
	}

	@Override
	public List<NoodsVO> queryNoodsForGroup(NoodsVO noodsVO) {

		List<NoodsPO> noodsPOs = noodsDao.queryNoodsForGroup(noodsVO.getName(), 10);
		List<NoodsVO> noodsVOs = new ArrayList<NoodsVO>();

		for (NoodsPO noodsPO : noodsPOs) {

			NoodsVO noodsVO2 = new NoodsVO();

			BeanUtil.copyProperties(noodsPO, noodsVO2);

			noodsVOs.add(noodsVO2);
		}

		return noodsVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addNoods(NoodsVO noodsVO, int company) throws FLException {

		NoodsPO noodsPO = new NoodsPO();

		BeanUtil.copyProperties(noodsVO, noodsPO);

		noodsPO.setStatus(NoodsPO.STATUS_ENABLE_INT);
		noodsPO.setCompany(company);

		noodsDao.save(noodsPO);

		BeanUtil.copyProperties(noodsPO, noodsVO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateNoods(NoodsVO noodsVO) throws FLException {

		NoodsPO noodsPO = noodsDao.get(noodsVO.getNid());

		if (noodsPO == null) {
			throw new FLException(130118, "定材不存在");
		}

		BeanUtil.copyProperties(noodsVO, noodsPO);

		noodsDao.update(noodsPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateNoodsForStatus(NoodsVO noodsVO) throws FLException {

		NoodsPO noodsPO = noodsDao.get(noodsVO.getNid());

		if (noodsPO == null) {
			throw new FLException(130118, "定材不存在");
		}

		noodsPO.setStatus(noodsVO.getStatus());

		noodsDao.update(noodsPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateNoodsForCalc(NoodsVO noodsVO) throws FLException {

		NoodsPO noodsPO = noodsDao.get(noodsVO.getNid());

		if (noodsPO == null) {
			throw new FLException(130118, "定材不存在");
		}

		noodsPO.setCalc(noodsVO.getCalc());

		noodsDao.update(noodsPO);

		return 0;
	}

}
