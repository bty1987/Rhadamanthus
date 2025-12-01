/**
 * @File Name		: GoodsStorehouseStockServiceImpl.java
 * @Package   	: com.fanglin.inventory.service.impl
 * @Version		: 1.0
 * @Date			: 2016-9-19
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.inventory.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.material.dao.ColorDao;
import com.fanglin.data.material.dao.FormatDao;
import com.fanglin.data.material.dao.GoodsDao;
import com.fanglin.data.material.dao.GoodsPackageDao;
import com.fanglin.data.material.vo.ColorVO;
import com.fanglin.data.material.vo.FormatVO;
import com.fanglin.data.material.vo.GoodsVO;
import com.fanglin.data.po.ColorPO;
import com.fanglin.data.po.FormatPO;
import com.fanglin.data.po.GoodsPO;
import com.fanglin.data.po.GoodsPackagePO;
import com.fanglin.inventory.dao.GoodsStorehouseStockDao;
import com.fanglin.inventory.dao.StorehouseDao;
import com.fanglin.inventory.dao.StorehouseUserDao;
import com.fanglin.inventory.po.GoodsStorehouseStockPO;
import com.fanglin.inventory.po.StorehousePO;
import com.fanglin.inventory.po.StorehouseUserPO;
import com.fanglin.inventory.service.GoodsStorehouseStockService;
import com.fanglin.inventory.service.ManifestService;
import com.fanglin.inventory.vo.GoodsStorehouseStockVO;
import com.fanglin.inventory.vo.ManifestItemVO;
import com.fanglin.inventory.vo.StorehouseVO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("goodsStorehouseStockService")
@Transactional(readOnly = true)
public class GoodsStorehouseStockServiceImpl implements GoodsStorehouseStockService {

	@Autowired
	private GoodsStorehouseStockDao goodsStorehouseStockDao;

	@Autowired
	private GoodsDao goodsDao;

	@Autowired
	private StorehouseDao storehouseDao;

	@Autowired
	private StorehouseUserDao storehouseUserDao;

	@Autowired
	private GoodsPackageDao goodsPackageDao;

	@Autowired
	private ManifestService manifestService;
	
	@Autowired
	private ColorDao colorDao;
	
	@Autowired
	private FormatDao formatDao;
	
	@Override
	public void pageGoodsStorehouseStock(Paging paging, List<Filter> filters, String userId) {

		List<StorehouseUserPO> storehouseUserPOs = storehouseUserDao.queryStorehouseUserByUserId(userId);
		List<Long> shids = new ArrayList<Long>();
		List<GoodsStorehouseStockVO> goodsStorehouseStockVOs = new ArrayList<GoodsStorehouseStockVO>();

		if (storehouseUserPOs.size() != 0) {

			for (StorehouseUserPO storehouseUserPO : storehouseUserPOs) {

				long shid = storehouseUserPO.getStorehouse().getShid();

				shids.add(shid);
			}

			List<GoodsStorehouseStockPO> goodsStorehouseStockPOs = goodsStorehouseStockDao.pageGoodsStorehouseStock(paging, filters, shids);

			GoodsStorehouseStockVO goodsStorehouseStockVO;

			for (GoodsStorehouseStockPO goodsStorehouseStockPO : goodsStorehouseStockPOs) {

				goodsStorehouseStockVO = new GoodsStorehouseStockVO(new GoodsVO(), new ColorVO(), new FormatVO(), new StorehouseVO());

				goodsStorehouseStockVO.setGshsid(goodsStorehouseStockVO.getGshsid());
				goodsStorehouseStockVO.setNum(goodsStorehouseStockPO.getNum());

				BeanUtil.copyProperties(goodsStorehouseStockPO.getGoods(), goodsStorehouseStockVO.getGoods(), Arrays.asList("accessoriesType"));
				BeanUtil.copyProperties(goodsStorehouseStockPO.getColor(), goodsStorehouseStockVO.getColor());
				BeanUtil.copyProperties(goodsStorehouseStockPO.getFormat(), goodsStorehouseStockVO.getFormat());
				BeanUtil.copyProperties(goodsStorehouseStockPO.getStorehouse(), goodsStorehouseStockVO.getStorehouse());

				goodsStorehouseStockVOs.add(goodsStorehouseStockVO);
			}

		}

		paging.setData(goodsStorehouseStockVOs);
	}

	@Override
	public Integer queryGoodsStorehouseStockByGid(GoodsStorehouseStockVO goodsStorehouseStockVO) {

		Integer nums = goodsStorehouseStockDao.queryGoodsStorehouseStockByGid(goodsStorehouseStockVO.getGoods().getGid(), goodsStorehouseStockVO.getColor().getCid(), goodsStorehouseStockVO.getFormat().getFid());

		return nums;
	}

	@Override
	public GoodsStorehouseStockVO queryStorehouseStockByShidAGid(GoodsStorehouseStockVO goodsStorehouseStockVO) {

		GoodsStorehouseStockPO goodsStorehouseStockPO = goodsStorehouseStockDao.queryGoodsStorehouseStockByShidAGid(goodsStorehouseStockVO.getGoods().getGid(), goodsStorehouseStockVO.getColor().getCid(), goodsStorehouseStockVO.getFormat().getFid(), goodsStorehouseStockVO.getStorehouse().getShid());

		goodsStorehouseStockVO = new GoodsStorehouseStockVO();

		BeanUtil.copyProperties(goodsStorehouseStockPO, goodsStorehouseStockVO, Arrays.asList("goods", "color", "format", "storehouse"));

		return goodsStorehouseStockVO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int makeGoodsStorehouseStock(GoodsStorehouseStockVO goodsStorehouseStockVO) throws FLException {

		GoodsStorehouseStockPO goodsStorehouseStockPO = goodsStorehouseStockDao.queryGoodsStorehouseStockByShidAGid(goodsStorehouseStockVO.getGoods().getGid(), goodsStorehouseStockVO.getColor().getCid(), goodsStorehouseStockVO.getFormat().getFid(), goodsStorehouseStockVO.getStorehouse().getShid());

		if (goodsStorehouseStockPO != null) {

			throw new FLException(260042, "商品库存已存在");

		}

		goodsStorehouseStockPO = new GoodsStorehouseStockPO(new GoodsPO(), new ColorPO(), new FormatPO(), new StorehousePO());

		BeanUtil.copyPropertie(goodsStorehouseStockVO.getGoods(), goodsStorehouseStockPO.getGoods());
		BeanUtil.copyPropertie(goodsStorehouseStockVO.getColor(), goodsStorehouseStockPO.getColor());
		BeanUtil.copyPropertie(goodsStorehouseStockVO.getFormat(), goodsStorehouseStockPO.getFormat());
		BeanUtil.copyPropertie(goodsStorehouseStockVO.getStorehouse(), goodsStorehouseStockPO.getStorehouse());

		goodsStorehouseStockPO.setNum(0);

		goodsStorehouseStockDao.save(goodsStorehouseStockPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void plusGoodsStorehouseStock(GoodsStorehouseStockVO goodsStorehouseStockVO, String userId, int company) throws FLException {

		int num = goodsStorehouseStockVO.getNum();
		
		long shid = goodsStorehouseStockVO.getStorehouse().getShid();
		
		List<ManifestItemVO> manifestItemVOs = new ArrayList<ManifestItemVO>();
		
		manifestItemVOs.add(new ManifestItemVO().init(goodsStorehouseStockVO.getGoods().getGid(), goodsStorehouseStockVO.getColor().getCid(), goodsStorehouseStockVO.getFormat().getFid(), shid, null, 0, 0, num));
			
		manifestService.addManifestForCP(manifestItemVOs, userId, company);
	}
	
	@Override
	@Transactional(rollbackFor = Exception.class)
	public void loseGoodsStorehouseStock(GoodsStorehouseStockVO goodsStorehouseStockVO, String userId,int company) throws FLException {
		
		int num = goodsStorehouseStockVO.getNum();
		
		long shid = goodsStorehouseStockVO.getStorehouse().getShid();
		
		List<ManifestItemVO> manifestItemVOs = new ArrayList<ManifestItemVO>();
		
		manifestItemVOs.add(new ManifestItemVO().init(goodsStorehouseStockVO.getGoods().getGid(), goodsStorehouseStockVO.getColor().getCid(), goodsStorehouseStockVO.getFormat().getFid(), null, shid, 0, 0, num));
			
		manifestService.addManifestForCL(manifestItemVOs, userId, company);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int mergePackage(GoodsStorehouseStockVO goodsStorehouseStockVO, String userId, int company) throws FLException {

		List<ManifestItemVO> manifestItemVOs = new ArrayList<ManifestItemVO>();

		GoodsPO goodsPO = goodsDao.get(goodsStorehouseStockVO.getGoods().getGid());

		if (goodsPO.getType() != GoodsPO.TYPE_SUIT_INT) {
			throw new FLException(260041, "套餐不存在");
		}

		int num = goodsStorehouseStockVO.getNum();
		long shid = goodsStorehouseStockVO.getStorehouse().getShid();

		manifestItemVOs.add(new ManifestItemVO().init(goodsStorehouseStockVO.getGoods().getGid(), goodsStorehouseStockVO.getColor().getCid(), goodsStorehouseStockVO.getFormat().getFid(), shid, null, 0, 0, num));

		List<GoodsPackagePO> goodsPackagePOs = goodsPackageDao.queryPackage(goodsStorehouseStockVO.getGoods().getGid());

		for (GoodsPackagePO goodsPackagePO : goodsPackagePOs) {
			manifestItemVOs.add(new ManifestItemVO().init(goodsPackagePO.getGoods().getGid(), goodsPackagePO.getColor().getCid(), goodsPackagePO.getFormat().getFid(), null, shid, 0, 0, Arith.mul(num, goodsPackagePO.getNum())));
		}

		manifestService.addManifestForPM(manifestItemVOs, userId, company);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int splitPackage(GoodsStorehouseStockVO goodsStorehouseStockVO, String userId, int company) throws FLException {

		List<ManifestItemVO> manifestItemVOs = new ArrayList<ManifestItemVO>();

		GoodsPO goodsPO = goodsDao.get(goodsStorehouseStockVO.getGoods().getGid());

		if (goodsPO.getType() != GoodsPO.TYPE_SUIT_INT) {
			throw new FLException(260041, "套餐不存在");
		}

		int num = goodsStorehouseStockVO.getNum();
		long shid = goodsStorehouseStockVO.getStorehouse().getShid();

		manifestItemVOs.add(new ManifestItemVO().init(goodsStorehouseStockVO.getGoods().getGid(), goodsStorehouseStockVO.getColor().getCid(), goodsStorehouseStockVO.getFormat().getFid(), null, shid, 0, 0, num));

		List<GoodsPackagePO> goodsPackagePOs = goodsPackageDao.queryPackage(goodsStorehouseStockVO.getGoods().getGid());

		for (GoodsPackagePO goodsPackagePO : goodsPackagePOs) {
			manifestItemVOs.add(new ManifestItemVO().init(goodsPackagePO.getGoods().getGid(), goodsPackagePO.getColor().getCid(), goodsPackagePO.getFormat().getFid(), shid, null, 0, 0, Arith.mul(num, goodsPackagePO.getNum())));
		}

		manifestService.addManifestForPS(manifestItemVOs, userId, company);

		return 0;
	}

	public StorehousePO instorehouse(long gid, long cid, long fid, long shid, int num) throws FLException {

		if (goodsDao.get(gid) == null) {
			throw new FLException(260004, "商品不存在");
		}

		if (storehouseDao.get(shid) == null) {
			throw new FLException(260005, "仓库不存在");
		}

		GoodsStorehouseStockPO inGoodsStorehouseStockPO = goodsStorehouseStockDao.queryGoodsStorehouseStockByShidAGid(gid, cid, fid, shid);

		if (inGoodsStorehouseStockPO == null) {
			inGoodsStorehouseStockPO = new GoodsStorehouseStockPO();
			
			ColorPO colorPO = colorDao.get(cid);
			FormatPO formatPO = formatDao.get(fid);

			if (colorPO.getGid() != gid || formatPO.getGid() != gid) {
				throw new FLException(260053, "商品不匹配");
			}

			inGoodsStorehouseStockPO.setGoods(new GoodsPO(gid));
			inGoodsStorehouseStockPO.setColor(new ColorPO(cid));
			inGoodsStorehouseStockPO.setFormat(new FormatPO(fid));
			inGoodsStorehouseStockPO.setStorehouse(new StorehousePO(shid));

			inGoodsStorehouseStockPO.setNum(0);
			
		}

		inGoodsStorehouseStockPO.setNum(Arith.add(inGoodsStorehouseStockPO.getNum(), num));

		goodsStorehouseStockDao.saveOrUpdate(inGoodsStorehouseStockPO);

		return inGoodsStorehouseStockPO.getStorehouse();
	}

	public StorehousePO outstorehouse(long gid, long cid, long fid, long shid, int num) throws FLException {

		GoodsStorehouseStockPO outGoodsStorehouseStockPO = goodsStorehouseStockDao.queryGoodsStorehouseStockByShidAGid(gid, cid, fid, shid);

		if (outGoodsStorehouseStockPO == null) {
			throw new FLException(260011, "商品库存不存在");
		}

		if (outGoodsStorehouseStockPO.getGoods() == null) {
			throw new FLException(260004, "商品不存在");
		}

		if (outGoodsStorehouseStockPO.getStorehouse() == null) {
			throw new FLException(260005, "仓库不存在");
		}

		if (outGoodsStorehouseStockPO.getNum() < num) {
			throw new FLException(260008, outGoodsStorehouseStockPO.getGoods().getName() + "商品库存不足");
		}

		outGoodsStorehouseStockPO.setNum(Arith.sub(outGoodsStorehouseStockPO.getNum(), num));

		goodsStorehouseStockDao.update(outGoodsStorehouseStockPO);

		return outGoodsStorehouseStockPO.getStorehouse();
	}

}
