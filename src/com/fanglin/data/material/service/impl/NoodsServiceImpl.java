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
import com.fanglin.quotation.dao.NormChangeRecordDao;
import com.fanglin.quotation.po.NormChangeRecordPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("noodsService")
@Transactional(readOnly = true)
public class NoodsServiceImpl implements NoodsService {

	@Autowired
	private NoodsDao noodsDao;

	@Autowired
	private NormChangeRecordDao normChangeRecordDao;

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
	public int updateNoods(NoodsVO noodsVO, String userId) throws FLException {

		NoodsPO noodsPO = noodsDao.get(noodsVO.getNid());

		if (noodsPO == null) {
			throw new FLException(130118, "定材不存在");
		}

		// 变更记录: 定材浮动额(先读旧值, surplus 变了才记)
		int oldSurplus = noodsPO.getSurplus();

		BeanUtil.copyProperties(noodsVO, noodsPO);

		noodsDao.update(noodsPO);

		if (noodsVO.getSurplus() != null && noodsVO.getSurplus() != oldSurplus) {
			normChangeRecordDao.save(new NormChangeRecordPO().init(NormChangeRecordPO.TYPE_NOODS_SURPLUS_INT, NormChangeRecordPO.CHANGETYPE_UPDATE_INT, userId)
					.refId(noodsPO.getNid()).refNo(noodsPO.getName())
					.before(String.format("浮动量: %d", oldSurplus)).after(String.format("浮动量: %d", noodsPO.getSurplus())));
		}

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
