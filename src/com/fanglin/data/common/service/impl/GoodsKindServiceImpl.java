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

			GoodsKindVO goodsKindVO = new GoodsKindVO(new GoodsKindVO());

			goodsKindPO.ptv(goodsKindVO);

			goodsKindVOs.add(goodsKindVO);
		}

		paging.setData(goodsKindVOs);
	}

	@Override
	public List<GoodsKindVO> queryGoodsKind() {

		List<GoodsKindPO> goodsKindPOs = goodsKindDao.queryGoodsKind();
		List<GoodsKindVO> goodsKindVOs = new ArrayList<GoodsKindVO>();

		for (GoodsKindPO goodsKindPO : goodsKindPOs) {

			GoodsKindVO goodsKindVO = new GoodsKindVO(new GoodsKindVO());

			goodsKindPO.ptv(goodsKindVO);

			goodsKindVOs.add(goodsKindVO);

		}

		return goodsKindVOs;
	}

	@Override
	public List<GoodsKindVO> queryGoodsKindByFgkid(GoodsKindVO goodsKind) throws FLException {

		List<GoodsKindPO> goodsKindPOs = goodsKindDao.queryGoodsKind(goodsKind.getParent().getGkid());
		List<GoodsKindVO> goodsKindVOs = new ArrayList<GoodsKindVO>();

		for (GoodsKindPO goodsKindPO : goodsKindPOs) {

			GoodsKindVO goodsKindVO = new GoodsKindVO(new GoodsKindVO());

			goodsKindPO.ptv(goodsKindVO);

			goodsKindVOs.add(goodsKindVO);

		}

		return goodsKindVOs;
	}

	@Override
	public GoodsKindVO queryGoodsKindByGkid(GoodsKindVO goodsKindVO) throws FLException {

		GoodsKindPO goodsKindPO = goodsKindDao.get(goodsKindVO.getGkid());

		if (goodsKindPO == null) {
			throw new FLException(130127, "类别不存在");
		}

		goodsKindVO = new GoodsKindVO(new GoodsKindVO());

		goodsKindPO.ptv(goodsKindVO);

		return goodsKindVO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addGoodsKind(GoodsKindVO goodsKindVO, int company) throws FLException {

		GoodsKindPO goodsKindPO = new GoodsKindPO();

		BeanUtil.copyPropertie(goodsKindVO, goodsKindPO, Arrays.asList("parent"));

		if (goodsKindVO.getParent() != null && goodsKindVO.getParent().getGkid() != null) goodsKindPO.setParent(new GoodsKindPO(goodsKindVO.getParent().getGkid()));

		goodsKindDao.save(goodsKindPO);

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateGoodsKind(GoodsKindVO goodsKindVO) throws FLException {

		GoodsKindPO goodsKindPO = goodsKindDao.get(goodsKindVO.getGkid());

		if (goodsKindPO == null) {
			throw new FLException(130127, "类别不存在");
		}

		BeanUtil.copyPropertie(goodsKindVO, goodsKindPO, Arrays.asList("status", "parent"));

		if (goodsKindVO.getParent() != null && goodsKindVO.getParent().getGkid() != null) goodsKindPO.setParent(new GoodsKindPO(goodsKindVO.getParent().getGkid()));

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
