package com.fanglin.data.common.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.dao.GoodsKindDao;
import com.fanglin.data.common.service.GoodsKindService;
import com.fanglin.data.common.vo.GoodsKindVO;
import com.fanglin.data.po.GoodsKindPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("goodsKindService")
@Transactional(readOnly = true)
public class GoodsKindServiceImpl implements GoodsKindService {

	@Autowired
	private GoodsKindDao goodsKindDao;

	@Override
	public void pageGoodsKind(Paging paging, List<Filter> filters) {

		List<GoodsKindPO> goodsKindPOs = goodsKindDao.pageGoodsKind(paging, filters);
		List<GoodsKindVO> goodsKindVOs = new ArrayList<GoodsKindVO>();

		for (GoodsKindPO goodsKindPO : goodsKindPOs) {

			GoodsKindVO goodsKindVO = new GoodsKindVO();

			BeanUtil.copyPropertie(goodsKindPO, goodsKindVO);

			goodsKindVOs.add(goodsKindVO);

		}

		paging.setData(goodsKindVOs);

	}

	@Override
	public List<GoodsKindVO> queryGoodsKind() {

		List<GoodsKindPO> goodsKindPOs = goodsKindDao.queryGoodsKind();
		List<GoodsKindVO> goodsKindVOs = new ArrayList<GoodsKindVO>();

		for (GoodsKindPO goodsKindPO : goodsKindPOs) {

			GoodsKindVO goodsKindVO = new GoodsKindVO();

			BeanUtil.copyPropertie(goodsKindPO, goodsKindVO);

			goodsKindVOs.add(goodsKindVO);

		}

		return goodsKindVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addGoodsKind(GoodsKindVO goodsKindVO, int company) {

		GoodsKindPO goodsKindPO = new GoodsKindPO();

		BeanUtil.copyPropertie(goodsKindVO, goodsKindPO);

		goodsKindDao.save(goodsKindPO);

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateGoodsKind(GoodsKindVO goodsKind) throws FLException {

		GoodsKindPO goodsKindPO = goodsKindDao.get(goodsKind.getGkid());

		if (goodsKindPO == null) {
			throw new FLException(130127, "类别不存在");
		}

		BeanUtil.copyPropertie(goodsKind, goodsKindPO, Arrays.asList("status"));

		goodsKindDao.update(goodsKindPO);

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateGoodsKindForStatus(GoodsKindVO goodsKind) throws FLException {

		GoodsKindPO goodsKindPO = goodsKindDao.get(goodsKind.getGkid());

		if (goodsKindPO == null) {
			throw new FLException(130127, "类别不存在");
		}

		goodsKindPO.setStatus(goodsKind.getStatus());

		goodsKindDao.update(goodsKindPO);

	}
}
