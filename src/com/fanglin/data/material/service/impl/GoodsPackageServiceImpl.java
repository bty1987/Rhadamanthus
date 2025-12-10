package com.fanglin.data.material.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.material.dao.GoodsDao;
import com.fanglin.data.material.dao.GoodsPackageDao;
import com.fanglin.data.material.service.GoodsPackageService;
import com.fanglin.data.material.vo.ColorVO;
import com.fanglin.data.material.vo.FormatVO;
import com.fanglin.data.material.vo.GoodsPackageVO;
import com.fanglin.data.material.vo.GoodsVO;
import com.fanglin.data.po.ColorPO;
import com.fanglin.data.po.FormatPO;
import com.fanglin.data.po.GoodsPO;
import com.fanglin.data.po.GoodsPackagePO;
import com.fanglin.utils.BeanUtil;

@Service("goodsPackageService")
@Transactional(readOnly = true)
public class GoodsPackageServiceImpl implements GoodsPackageService {

	@Autowired
	private GoodsPackageDao goodsPackageDao;

	@Autowired
	private GoodsDao goodsDao;

	@Override
	public List<GoodsPackageVO> queryGoodsPackage(GoodsPackageVO goodsPackageVO) {

		List<GoodsPackagePO> goodsPackagePOs = goodsPackageDao.queryGoodsPackage(goodsPackageVO.getPid());
		List<GoodsPackageVO> goodsPackageVOs = new ArrayList<GoodsPackageVO>();

		for (GoodsPackagePO goodsPackagePO : goodsPackagePOs) {
			goodsPackageVOs.add(goodsPackagePO.ptv(new GoodsPackageVO(new GoodsVO(), new ColorVO(), new FormatVO())));
		}

		return goodsPackageVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addGoodsPackage(GoodsVO goodsVO, List<GoodsPackageVO> goodsPackageVOs, int company) throws FLException {

		GoodsPO goodsPO = goodsDao.get(goodsVO.getGid());

		if (goodsPO == null) {
			throw new FLException(260004, "商品不存在");
		}

		for (GoodsPackageVO goodsPackageVO : goodsPackageVOs) {

			if (goodsPackageVO.getGoods() == null) continue;
			if (goodsPackageVO.getGoods().getGid() == null) continue;

			GoodsPO goodsGP = goodsDao.get(goodsPackageVO.getGoods().getGid());

			if (goodsGP == null) continue;

			short type = goodsGP.getType();

			if (type == 1) {
				throw new FLException(260043, "套餐归属商品不可为套餐");
			}

			GoodsPackagePO goodsPackagePO = new GoodsPackagePO(new GoodsPO(), new ColorPO(), new FormatPO());

			BeanUtil.copyProperties(goodsPackageVO, goodsPackagePO, Arrays.asList("pid", "goods", "color", "format"));

			goodsPackagePO.setGoods(goodsGP);
			goodsPackagePO.setColor(new ColorPO(goodsPackageVO.getColor().getCid()));
			goodsPackagePO.setFormat(new FormatPO(goodsPackageVO.getFormat().getFid()));

			goodsPackagePO.setPid(goodsPO.getGid());

			goodsPackageDao.save(goodsPackagePO);
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateGoodsPackage(GoodsPackageVO goodsPackageVO) throws FLException {

		GoodsPackagePO goodsPackagePO = goodsPackageDao.get(goodsPackageVO.getGpid());

		if (goodsPackagePO == null) {
			throw new FLException(260041, "套餐不存在");
		}

		GoodsPO goodsPO = goodsDao.get(goodsPackageVO.getGoods().getGid());

		if (goodsPO == null) {
			throw new FLException(260004, "商品不存在");
		}

		BeanUtil.copyProperties(goodsPackageVO, goodsPackagePO, Arrays.asList("pid", "goods", "color", "format"));

		goodsPackagePO.setGoods(goodsPO);
		goodsPackagePO.setColor(new ColorPO(goodsPackageVO.getColor().getCid()));
		goodsPackagePO.setFormat(new FormatPO(goodsPackageVO.getFormat().getFid()));

		goodsPackageDao.save(goodsPackagePO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void deleteGoodsPackage(GoodsPackageVO goodsPackageVO) throws FLException {

		GoodsPackagePO goodsPackagePO = goodsPackageDao.get(goodsPackageVO.getGpid());

		if (goodsPackagePO == null) {
			throw new FLException(260062, "套餐商品不存在");
		}

		goodsPackageDao.delete(goodsPackagePO);
	}

}
