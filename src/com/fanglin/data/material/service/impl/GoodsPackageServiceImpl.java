package com.fanglin.data.material.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.dao.BrandDao;
import com.fanglin.communion.po.BrandPO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.material.dao.GoodsDao;
import com.fanglin.data.material.dao.GoodsPackageDao;
import com.fanglin.data.material.service.GoodsPackageService;
import com.fanglin.data.material.vo.ColorVO;
import com.fanglin.data.material.vo.FormatVO;
import com.fanglin.data.material.vo.GoodsPackageVO;
import com.fanglin.data.material.vo.GoodsVO;
import com.fanglin.data.po.AccessoriesTypePO;
import com.fanglin.data.po.ColorPO;
import com.fanglin.data.po.FormatPO;
import com.fanglin.data.po.GoodsKindPO;
import com.fanglin.data.po.GoodsPO;
import com.fanglin.data.po.GoodsPackagePO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.PinYin4Util;

@Service("goodsPackageService")
@Transactional(readOnly = true)
public class GoodsPackageServiceImpl implements GoodsPackageService {

	@Autowired
	private GoodsPackageDao goodsPackageDao;

	@Autowired
	private GoodsDao goodsDao;

	@Autowired
	private BrandDao brandDao;

	@Override
	public List<GoodsPackageVO> queryGoodsPackage(GoodsPackageVO goodsPackageVO) {

		List<GoodsPackagePO> goodsPackagePOs = goodsPackageDao.queryPackage(goodsPackageVO.getPid());
		List<GoodsPackageVO> goodsPackageVOs = new ArrayList<GoodsPackageVO>();

		for (GoodsPackagePO goodsPackagePO : goodsPackagePOs) {

			goodsPackageVO = new GoodsPackageVO(new GoodsVO(), new ColorVO(), new FormatVO());

			BeanUtil.copyProperties(goodsPackagePO, goodsPackageVO, Arrays.asList("goods", "color", "format"));
			BeanUtil.copyProperties(goodsPackagePO.getGoods(), goodsPackageVO.getGoods(), Arrays.asList("accessoriesType"));
			BeanUtil.copyProperties(goodsPackagePO.getColor(), goodsPackageVO.getColor());
			BeanUtil.copyProperties(goodsPackagePO.getFormat(), goodsPackageVO.getFormat());

			goodsPackageVOs.add(goodsPackageVO);

		}

		return goodsPackageVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addGoodsPackage(GoodsVO goodsVO, List<GoodsPackageVO> goodsPackageVOs, int company) throws FLException {

		GoodsPO goodsPO = new GoodsPO();

		if (goodsVO.getAccessoriesType() != null && goodsVO.getAccessoriesType().getAtid() != null) goodsPO.setAccessoriesType(new AccessoriesTypePO(goodsVO.getAccessoriesType().getAtid()));

		if (goodsVO.getZerokind() != null && goodsVO.getZerokind().getGkid() != null) goodsPO.setZerokind(new GoodsKindPO(goodsVO.getZerokind().getGkid()));
		if (goodsVO.getOnekind() != null && goodsVO.getOnekind().getGkid() != null) goodsPO.setOnekind(new GoodsKindPO(goodsVO.getOnekind().getGkid()));
		if (goodsVO.getTwokind() != null && goodsVO.getTwokind().getGkid() != null) goodsPO.setTwokind(new GoodsKindPO(goodsVO.getTwokind().getGkid()));
		if (goodsVO.getThrkind() != null && goodsVO.getThrkind().getGkid() != null) goodsPO.setThrkind(new GoodsKindPO(goodsVO.getThrkind().getGkid()));

		List<String> pinyins = PinYin4Util.getPinyin(goodsVO.getName());

		goodsPO.setPinyin(pinyins.subList(0, pinyins.size() >= 2 ? 2 : pinyins.size()).toString());

		goodsPO.setAlias(goodsVO.getAlias());
		goodsPO.setStatus(GoodsPO.STATUS_ENABLE_INT);
		goodsPO.setType(GoodsPO.TYPE_SUIT_INT);
		goodsPO.setCompany(company);

		BrandPO brandPO = brandDao.get(goodsVO.getBid());
		String brandName = brandPO.getName();

		goodsPO.setBrand(brandName);

		goodsDao.save(goodsPO);

		goodsPO = goodsDao.get(goodsPO.getGid());

		if (goodsPO == null) {
			throw new FLException(260004, "商品不存在");
		}

		String brand = goodsPO.getBrand();

		for (GoodsPackageVO goodsPackageVO : goodsPackageVOs) {

			GoodsPackagePO goodsPackagePO = new GoodsPackagePO(new GoodsPO(), new ColorPO(), new FormatPO());

			if (goodsPackageVO.getGoods().getGid() == null) {
				throw new FLException(260004, "商品不存在");
			}

			String brandPackage = goodsDao.get(goodsPackageVO.getGoods().getGid()).getBrand();

			short typePackage = goodsDao.get(goodsPackageVO.getGoods().getGid()).getType();

			if (typePackage == 1) {
				throw new FLException(260043, "套餐归属商品不可为套餐");
			}

			if (!brand.equals(brandPackage)) {
				throw new FLException(260044, "品牌不一致");
			}

			BeanUtil.copyProperties(goodsPackageVO, goodsPackagePO, Arrays.asList("pid", "goods", "color", "format"));
			BeanUtil.copyProperties(goodsPackageVO.getGoods(), goodsPackagePO.getGoods(), Arrays.asList("accessoriesType", "zerokind", "onekind", "twokind", "thrkind"));
			BeanUtil.copyProperties(goodsPackageVO.getColor(), goodsPackagePO.getColor());
			BeanUtil.copyProperties(goodsPackageVO.getFormat(), goodsPackagePO.getFormat());

			goodsPackagePO.setPid(goodsPO.getGid());

			goodsPackageDao.save(goodsPackagePO);
		}

		return 0;
	}

}
