package com.fanglin.data.material.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.construction.po.ConstructionCostPO;
import com.fanglin.construction.vo.ConstructionCostVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.material.dao.AoodsCostDao;
import com.fanglin.data.material.service.AoodsCostService;
import com.fanglin.data.material.vo.AccessoriesTypeVO;
import com.fanglin.data.material.vo.AoodsCostVO;
import com.fanglin.data.material.vo.AoodsVO;
import com.fanglin.data.material.vo.GoodsVO;
import com.fanglin.data.po.AoodsCostPO;
import com.fanglin.data.po.AoodsPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("aoodsCostService")
@Transactional(readOnly = true)
public class AoodsCostServiceImpl implements AoodsCostService {

	@Autowired
	private AoodsCostDao aoodsCostDao;

	@Override
	public void pageAoodsCost(Paging paging, List<Filter> filters, AoodsCostVO aoodsCostVO) {

		List<AoodsCostPO> aoodsCostPOs = aoodsCostDao.pageAoodsCost(paging, filters, aoodsCostVO.getAoods().getAid());
		List<AoodsCostVO> aoodsCostVOs = new ArrayList<AoodsCostVO>();

		for (AoodsCostPO aoodsCostPO : aoodsCostPOs) {

			aoodsCostVO = new AoodsCostVO(new AoodsVO(new GoodsVO(), new AccessoriesTypeVO()), new ConstructionCostVO());

			BeanUtil.copyProperties(aoodsCostPO, aoodsCostVO, Arrays.asList("aoods", "constructionCost"));
			BeanUtil.copyProperties(aoodsCostPO.getAoods(), aoodsCostVO.getAoods(), Arrays.asList("goods", "accessoriesType", "bompany"));
			aoodsCostPO.getAoods().getGoods().ptv(aoodsCostVO.getAoods().getGoods());
			BeanUtil.copyProperties(aoodsCostPO.getConstructionCost(), aoodsCostVO.getConstructionCost());

			aoodsCostVOs.add(aoodsCostVO);
		}

		paging.setData(aoodsCostVOs);

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addAoodsCost(AoodsCostVO aoodsCostVO) throws FLException {

		AoodsCostPO aoodsCostPO = new AoodsCostPO();

		if (aoodsCostDao.countAoodsCost(aoodsCostVO.getAoods().getAid(), aoodsCostVO.getConstructionCost().getCcid()) > 0) {
			throw new FLException(130035, "辅材成本已存在");
		}

		aoodsCostPO.setAoods(new AoodsPO(aoodsCostVO.getAoods().getAid()));
		aoodsCostPO.setConstructionCost(new ConstructionCostPO(aoodsCostVO.getConstructionCost().getCcid()));
		aoodsCostPO.setNumLimit(aoodsCostVO.getNumLimit());

		aoodsCostDao.save(aoodsCostPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteAoodsCost(AoodsCostVO aoodsCostVO) {

		AoodsCostPO aoodsCostPO = aoodsCostDao.get(aoodsCostVO.getAcid());

		aoodsCostDao.delete(aoodsCostPO);

		return 0;
	}

}
