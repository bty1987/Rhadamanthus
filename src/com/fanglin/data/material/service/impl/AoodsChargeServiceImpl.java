package com.fanglin.data.material.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.material.dao.AoodsChargeDao;
import com.fanglin.data.material.service.AoodsChargeService;
import com.fanglin.data.material.vo.AoodsChargeVO;
import com.fanglin.data.material.vo.AoodsVO;
import com.fanglin.data.po.AoodsChargePO;
import com.fanglin.data.po.AoodsPO;
import com.fanglin.utils.Paging;

@Service("aoodsChargeService")
@Transactional(readOnly = true)
public class AoodsChargeServiceImpl implements AoodsChargeService {

	@Autowired
	private AoodsChargeDao aoodsChargeDao;

	@Override
	public void pageAoodsCharge(Paging paging, List<Filter> filters, Long aid) {
		List<AoodsChargePO> aoodsChargePOs = aoodsChargeDao.pageAoodsCharge(paging, filters, aid);
		List<AoodsChargeVO> aoodsChargeVOs = new ArrayList<AoodsChargeVO>();

		for (AoodsChargePO aoodsChargePO : aoodsChargePOs) {
			AoodsChargeVO aoodsChargeVO = new AoodsChargeVO(new AoodsVO());
			aoodsChargePO.ptv(aoodsChargeVO);
			aoodsChargeVOs.add(aoodsChargeVO);
		}

		paging.setData(aoodsChargeVOs);
	}

	@Override
	public List<AoodsChargeVO> queryAoodsChargeByAid(AoodsChargeVO aoodsChargeVO) {
		Long aid = aoodsChargeVO != null && aoodsChargeVO.getAoods() != null ? aoodsChargeVO.getAoods().getAid() : null;
		Short type = aoodsChargeVO != null ? aoodsChargeVO.getType() : null;

		List<AoodsChargePO> aoodsChargePOs = aoodsChargeDao.queryAoodsChargeByAid(aid, type);
		List<AoodsChargeVO> aoodsChargeVOs = new ArrayList<AoodsChargeVO>();

		for (AoodsChargePO aoodsChargePO : aoodsChargePOs) {
			AoodsChargeVO vo = new AoodsChargeVO(new AoodsVO());
			aoodsChargePO.ptv(vo);
			aoodsChargeVOs.add(vo);
		}

		return aoodsChargeVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addAoodsCharge(AoodsChargeVO aoodsChargeVO) throws FLException {
		AoodsChargePO aoodsChargePO = new AoodsChargePO();

		if (aoodsChargeVO.getAoods() != null && aoodsChargeVO.getAoods().getAid() != null) {
			aoodsChargePO.setAoods(new AoodsPO(aoodsChargeVO.getAoods().getAid()));
		}

		aoodsChargePO.setName(aoodsChargeVO.getName());
		aoodsChargePO.setPrice(aoodsChargeVO.getPrice() != null ? aoodsChargeVO.getPrice() : 0);
		aoodsChargePO.setSurplus(aoodsChargeVO.getSurplus() != null ? aoodsChargeVO.getSurplus() : 0);
		aoodsChargePO.setType(aoodsChargeVO.getType() != null ? aoodsChargeVO.getType() : AoodsChargePO.TYPE_COMMON_SHORT);
		aoodsChargePO.setStatus(aoodsChargeVO.getStatus() != null ? aoodsChargeVO.getStatus() : AoodsChargePO.STATUS_ENABLE_SHORT);
		aoodsChargePO.setSort(aoodsChargeVO.getSort() != null ? aoodsChargeVO.getSort() : 0);

		aoodsChargeDao.save(aoodsChargePO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateAoodsCharge(AoodsChargeVO aoodsChargeVO) throws FLException {
		AoodsChargePO aoodsChargePO = aoodsChargeDao.get(aoodsChargeVO.getAcid());

		if (aoodsChargePO == null) {
			throw new FLException(130036, "辅材费用不存在");
		}

		aoodsChargePO.setName(aoodsChargeVO.getName());
		if (aoodsChargeVO.getPrice() != null) {
			aoodsChargePO.setPrice(aoodsChargeVO.getPrice());
		}
		if (aoodsChargeVO.getSurplus() != null) {
			aoodsChargePO.setSurplus(aoodsChargeVO.getSurplus());
		}
		if (aoodsChargeVO.getType() != null) {
			aoodsChargePO.setType(aoodsChargeVO.getType());
		}
		if (aoodsChargeVO.getStatus() != null) {
			aoodsChargePO.setStatus(aoodsChargeVO.getStatus());
		}
		if (aoodsChargeVO.getSort() != null) {
			aoodsChargePO.setSort(aoodsChargeVO.getSort());
		}

		aoodsChargeDao.update(aoodsChargePO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteAoodsCharge(AoodsChargeVO aoodsChargeVO) {
		AoodsChargePO aoodsChargePO = aoodsChargeDao.get(aoodsChargeVO.getAcid());

		if (aoodsChargePO != null) {
			aoodsChargeDao.delete(aoodsChargePO);
		}

		return 0;
	}

}
