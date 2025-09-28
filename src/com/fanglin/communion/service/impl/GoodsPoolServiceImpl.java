package com.fanglin.communion.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.dao.BrandDao;
import com.fanglin.communion.dao.GoodsPoolDao;
import com.fanglin.communion.po.BrandPO;
import com.fanglin.communion.po.GoodsPoolPO;
import com.fanglin.communion.service.GoodsPoolService;
import com.fanglin.communion.vo.GoodsPoolVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.vo.GoodsKindVO;
import com.fanglin.data.material.dao.GoodsDao;
import com.fanglin.data.material.vo.AccessoriesTypeVO;
import com.fanglin.data.po.AccessoriesTypePO;
import com.fanglin.data.po.GoodsKindPO;
import com.fanglin.data.po.GoodsPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;
import com.fanglin.utils.PinYin4Util;

@Service("goodsPoolService")
@Transactional(readOnly = true)
public class GoodsPoolServiceImpl implements GoodsPoolService {

	@Autowired
	private GoodsPoolDao goodsPoolDao;

	@Autowired
	private BrandDao brandDao;

	@Autowired
	private GoodsDao goodsDao;

	@Override
	public void pageGoodsPool(Paging paging, List<Filter> filters, GoodsPoolVO goodsPool) throws FLException {

		if (goodsPool != null && goodsPool.getAtttype() != null) {
			filters.add(new Filter("atttype", String.valueOf(goodsPool.getAtttype()), "eq"));
		}

		List<GoodsPoolPO> goodsPoolPOs = goodsPoolDao.pageGoodsPool(paging, filters);

		List<GoodsPoolVO> goodsPoolVOs = new ArrayList<GoodsPoolVO>();

		GoodsPoolVO goodsPoolVO;

		for (GoodsPoolPO goodsPoolPO : goodsPoolPOs) {

			goodsPoolVO = new GoodsPoolVO(new AccessoriesTypeVO(), new GoodsKindVO(), new GoodsKindVO(), new GoodsKindVO(), new GoodsKindVO());

			goodsPoolVOs.add(goodsPoolPO.ptv(goodsPoolVO));
		}

		paging.setData(goodsPoolVOs);
	}

	@Override
	public List<GoodsPoolVO> queryGoodsPool(List<Filter> filters) throws FLException {

		List<GoodsPoolPO> goodsPoolPOs = goodsPoolDao.queryGoodsPool(filters);
		List<GoodsPoolVO> goodsPoolVOs = new ArrayList<GoodsPoolVO>();

		GoodsPoolVO goodsPoolVO;

		for (GoodsPoolPO goodsPoolPO : goodsPoolPOs) {

			goodsPoolVO = new GoodsPoolVO(new AccessoriesTypeVO(), new GoodsKindVO(), new GoodsKindVO(), new GoodsKindVO(), new GoodsKindVO());

			goodsPoolVOs.add(goodsPoolPO.ptv(goodsPoolVO));
		}

		return goodsPoolVOs;
	}

	@Override
	public List<GoodsPoolVO> queryGoodsPoolByNo(GoodsPoolVO goodsPoolVO) {

		List<GoodsPoolPO> goodsPoolPOs = goodsPoolDao.queryGoodsPoolByNo(goodsPoolVO.getNo(), 10);
		List<GoodsPoolVO> goodsPoolVOs = new ArrayList<GoodsPoolVO>();

		for (GoodsPoolPO goodsPoolPO : goodsPoolPOs) {

			goodsPoolVO = new GoodsPoolVO(new AccessoriesTypeVO(), new GoodsKindVO(), new GoodsKindVO(), new GoodsKindVO(), new GoodsKindVO());

			goodsPoolVOs.add(goodsPoolPO.ptv(goodsPoolVO));
		}

		return goodsPoolVOs;
	}

	@Override
	public List<GoodsPoolVO> queryGoodsPoolByName(GoodsPoolVO goodsPoolVO) {

		List<GoodsPoolPO> goodsPoolPOs = goodsPoolDao.queryGoodsPoolByName(goodsPoolVO.getName(), 10);
		List<GoodsPoolVO> goodsPoolVOs = new ArrayList<GoodsPoolVO>();

		for (GoodsPoolPO goodsPoolPO : goodsPoolPOs) {

			goodsPoolVO = new GoodsPoolVO(new AccessoriesTypeVO(), new GoodsKindVO(), new GoodsKindVO(), new GoodsKindVO(), new GoodsKindVO());

			goodsPoolVOs.add(goodsPoolPO.ptv(goodsPoolVO));
		}

		return goodsPoolVOs;
	}

	@Override
	public List<GoodsPoolVO> queryGoodsPoolByAtid(GoodsPoolVO goodsPoolVO) {

		List<GoodsPoolPO> goodsPoolPOs = goodsPoolDao.queryGoodsPoolByAtid(goodsPoolVO.getAccessoriesType().getAtid());
		List<GoodsPoolVO> goodsPoolVOs = new ArrayList<GoodsPoolVO>();

		for (GoodsPoolPO goodsPoolPO : goodsPoolPOs) {

			goodsPoolVO = new GoodsPoolVO(new AccessoriesTypeVO(), new GoodsKindVO(), new GoodsKindVO(), new GoodsKindVO(), new GoodsKindVO());

			goodsPoolVOs.add(goodsPoolPO.ptv(goodsPoolVO));

		}

		return goodsPoolVOs;
	}

	@Override
	public GoodsPoolVO queryGoodsPoolByBarcode(GoodsPoolVO goodsPoolVO) {

		GoodsPoolPO goodsPoolPO = goodsPoolDao.queryGoodsPoolByBarcode(goodsPoolVO.getBarcode());

		goodsPoolVO = new GoodsPoolVO(new AccessoriesTypeVO(), new GoodsKindVO(), new GoodsKindVO(), new GoodsKindVO(), new GoodsKindVO());

		return goodsPoolPO.ptv(goodsPoolVO);
	}

	@Override
	public GoodsPoolVO queryGoodsPoolByGpid(GoodsPoolVO goodsPoolVO) {

		GoodsPoolPO goodsPoolPO = goodsPoolDao.get(goodsPoolVO.getGpid());

		goodsPoolVO = new GoodsPoolVO(new AccessoriesTypeVO(), new GoodsKindVO(), new GoodsKindVO(), new GoodsKindVO(), new GoodsKindVO());

		return goodsPoolPO.ptv(goodsPoolVO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addGoodsPool(GoodsPoolVO goodsPoolVO) throws FLException {

		List<GoodsPoolPO> goodsPoolPOs = goodsPoolDao.queryGoodsPoolByName(goodsPoolVO.getName());

		if (goodsPoolPOs.size() > 0) {
			throw new FLException(260046, "商品已存在");
		}

		GoodsPoolPO goodsPoolPO = new GoodsPoolPO();

		BeanUtil.copyProperties(goodsPoolVO, goodsPoolPO, Arrays.asList("accessoriesType", "zerokind", "onekind", "twokind", "thrkind"));

		if (goodsPoolVO.getAccessoriesType() != null && goodsPoolVO.getAccessoriesType().getAtid() != null) goodsPoolPO.setAccessoriesType(new AccessoriesTypePO(goodsPoolVO.getAccessoriesType().getAtid()));

		if (goodsPoolVO.getZerokind() != null && goodsPoolVO.getZerokind().getGkid() != null) goodsPoolPO.setZerokind(new GoodsKindPO(goodsPoolVO.getZerokind().getGkid()));
		if (goodsPoolVO.getOnekind() != null && goodsPoolVO.getOnekind().getGkid() != null) goodsPoolPO.setOnekind(new GoodsKindPO(goodsPoolVO.getOnekind().getGkid()));
		if (goodsPoolVO.getTwokind() != null && goodsPoolVO.getTwokind().getGkid() != null) goodsPoolPO.setTwokind(new GoodsKindPO(goodsPoolVO.getTwokind().getGkid()));
		if (goodsPoolVO.getThrkind() != null && goodsPoolVO.getThrkind().getGkid() != null) goodsPoolPO.setThrkind(new GoodsKindPO(goodsPoolVO.getThrkind().getGkid()));

		List<String> pinyins = PinYin4Util.getPinyin(goodsPoolVO.getName());

		goodsPoolPO.setAlias(goodsPoolVO.getAlias());
		goodsPoolPO.setPinyin((String) pinyins.get(0));
		goodsPoolPO.setStatus(GoodsPoolPO.STATUS_ENABLE_INT);
		goodsPoolPO.setType(GoodsPoolPO.TYPE_GOODS_INT);

		BrandPO brandPO = brandDao.get(goodsPoolVO.getBid());
		String brandName = brandPO.getName();

		goodsPoolPO.setBrand(brandName);

		goodsPoolDao.save(goodsPoolPO);

		goodsPoolVO.setGpid(goodsPoolPO.getGpid());

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateGoodsPool(GoodsPoolVO goodsPoolVO) throws FLException {

		GoodsPoolPO goodsPoolPO = goodsPoolDao.get(goodsPoolVO.getGpid());

		if (goodsPoolPO == null) {
			throw new FLException(260004, "商品不存在");
		}

		BeanUtil.copyProperties(goodsPoolVO, goodsPoolPO, Arrays.asList("accessoriesType", "zerokind", "onekind", "twokind", "thrkind"));

		if (goodsPoolVO.getAccessoriesType() != null && goodsPoolVO.getAccessoriesType().getAtid() != null) goodsPoolPO.setAccessoriesType(new AccessoriesTypePO(goodsPoolVO.getAccessoriesType().getAtid()));

		if (goodsPoolVO.getZerokind() != null && goodsPoolVO.getZerokind().getGkid() != null) goodsPoolPO.setZerokind(new GoodsKindPO(goodsPoolVO.getZerokind().getGkid()));
		if (goodsPoolVO.getOnekind() != null && goodsPoolVO.getOnekind().getGkid() != null) goodsPoolPO.setOnekind(new GoodsKindPO(goodsPoolVO.getOnekind().getGkid()));
		if (goodsPoolVO.getTwokind() != null && goodsPoolVO.getTwokind().getGkid() != null) goodsPoolPO.setTwokind(new GoodsKindPO(goodsPoolVO.getTwokind().getGkid()));
		if (goodsPoolVO.getThrkind() != null && goodsPoolVO.getThrkind().getGkid() != null) goodsPoolPO.setThrkind(new GoodsKindPO(goodsPoolVO.getThrkind().getGkid()));

		goodsPoolDao.update(goodsPoolPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateGoodsPoolForStatus(GoodsPoolVO goodsPoolVO) throws FLException {

		GoodsPoolPO goodsPoolPO = goodsPoolDao.get(goodsPoolVO.getGpid());

		if (goodsPoolPO == null) {
			throw new FLException(260004, "商品不存在");
		}

		goodsPoolPO.setStatus(goodsPoolVO.getStatus());

		goodsPoolDao.update(goodsPoolPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int batchAddFromPool(List<GoodsPoolVO> goodsPools) throws FLException {

		if (goodsPools == null) {
			throw new FLException(260004, "没有选择商品");
		}

		for (GoodsPoolVO goodsPoolVO : goodsPools) {

			List<GoodsPO> Goodes = goodsDao.queryGoodsByGpid(goodsPoolVO.getGpid());

			if (Goodes != null && Goodes.size() > 0) {
				throw new FLException(260004, "申领的商品已存在");
			}

			GoodsPoolPO goodsPoolPO = goodsPoolDao.get(goodsPoolVO.getGpid());
			GoodsPO goodsPO = new GoodsPO();

			BeanUtil.copyProperties(goodsPoolPO, goodsPO, Arrays.asList("accessoriesType", "zerokind", "onekind", "twokind", "thrkind"));
			if (goodsPoolPO.getAccessoriesType() != null) goodsPO.setAccessoriesType(new AccessoriesTypePO(goodsPoolPO.getAccessoriesType().getAtid()));
			if (goodsPoolPO.getZerokind() != null) goodsPO.setZerokind(new GoodsKindPO(goodsPoolPO.getZerokind().getGkid()));
			if (goodsPoolPO.getOnekind() != null) goodsPO.setOnekind(new GoodsKindPO(goodsPoolPO.getOnekind().getGkid()));
			if (goodsPoolPO.getTwokind() != null) goodsPO.setTwokind(new GoodsKindPO(goodsPoolPO.getTwokind().getGkid()));
			if (goodsPoolPO.getThrkind() != null) goodsPO.setThrkind(new GoodsKindPO(goodsPoolPO.getThrkind().getGkid()));

			goodsDao.save(goodsPO);
		}

		return 0;
	}
}
