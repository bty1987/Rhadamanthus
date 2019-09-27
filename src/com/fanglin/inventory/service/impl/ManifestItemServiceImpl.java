/**
 * @File Name		: ManifestItemServiceImpl.java
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
import com.fanglin.inventory.dao.ManifestDao;
import com.fanglin.inventory.dao.ManifestItemDao;
import com.fanglin.inventory.po.ManifestItemPO;
import com.fanglin.inventory.po.ManifestPO;
import com.fanglin.inventory.service.GoodsStorehouseStockService;
import com.fanglin.inventory.service.ManifestItemService;
import com.fanglin.inventory.vo.ColorVO;
import com.fanglin.inventory.vo.FormatVO;
import com.fanglin.inventory.vo.GoodsVO;
import com.fanglin.inventory.vo.ManifestItemVO;
import com.fanglin.inventory.vo.ManifestVO;
import com.fanglin.inventory.vo.StorehouseVO;
import com.fanglin.utils.BeanUtil;

@Service("manifestItemService")
@Transactional(readOnly = true)
public class ManifestItemServiceImpl implements ManifestItemService {

	@Autowired
	private ManifestDao manifestDao;

	@Autowired
	private ManifestItemDao manifestItemDao;

	@Autowired
	private GoodsStorehouseStockService goodsStorehouseStockService;

	@Override
	public List<ManifestItemVO> queryManifestItemByMid(ManifestVO manifestVO) {

		List<ManifestItemPO> manifestItemPOs = manifestItemDao.queryManifestItemByMid(manifestVO.getMid());
		List<ManifestItemVO> manifestItemVOs = new ArrayList<ManifestItemVO>();

		ManifestItemVO manifestItemVO;

		for (ManifestItemPO manifestItemPO : manifestItemPOs) {

			manifestItemVO = new ManifestItemVO(new GoodsVO(), new ColorVO(), new FormatVO(), new StorehouseVO(), new StorehouseVO());

			BeanUtil.copyProperties(manifestItemPO, manifestItemVO, Arrays.asList("goods", "color", "format", "instorehouse", "outstorehouse"));
			BeanUtil.copyProperties(manifestItemPO.getGoods(), manifestItemVO.getGoods(), Arrays.asList("accessoriesType"));
			BeanUtil.copyProperties(manifestItemPO.getColor(), manifestItemVO.getColor());
			BeanUtil.copyProperties(manifestItemPO.getFormat(), manifestItemVO.getFormat());
			BeanUtil.copyProperties(manifestItemPO.getInstorehouse(), manifestItemVO.getInstorehouse());
			BeanUtil.copyProperties(manifestItemPO.getOutstorehouse(), manifestItemVO.getOutstorehouse());

			manifestItemVOs.add(manifestItemVO);
		}

		return manifestItemVOs;
	}

	@Override
	public List<ManifestItemVO> queryManifestItemBySiids(List<Long> siids) {

		List<ManifestItemPO> manifestItemPOs = manifestItemDao.queryManifestItemBySiids(siids);
		List<ManifestItemVO> manifestItemVOs = new ArrayList<ManifestItemVO>();

		ManifestItemVO manifestItemVO;

		for (ManifestItemPO manifestItemPO : manifestItemPOs) {

			manifestItemVO = new ManifestItemVO(new GoodsVO(), new ColorVO(), new FormatVO(), new StorehouseVO(), new StorehouseVO());

			BeanUtil.copyProperties(manifestItemPO, manifestItemVO, Arrays.asList("goods", "color", "format", "instorehouse", "outstorehouse"));
			BeanUtil.copyProperties(manifestItemPO.getGoods(), manifestItemVO.getGoods(), Arrays.asList("accessoriesType"));
			BeanUtil.copyProperties(manifestItemPO.getColor(), manifestItemVO.getColor());
			BeanUtil.copyProperties(manifestItemPO.getFormat(), manifestItemVO.getFormat());
			BeanUtil.copyProperties(manifestItemPO.getInstorehouse(), manifestItemVO.getInstorehouse());
			BeanUtil.copyProperties(manifestItemPO.getOutstorehouse(), manifestItemVO.getOutstorehouse());

			manifestItemVOs.add(manifestItemVO);
		}

		return manifestItemVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addManifestItem(ManifestVO manifestVO, ManifestItemVO manifestItemVO) throws FLException {

		ManifestPO manifestPO = manifestDao.get(manifestVO.getMid());

		if (manifestPO == null) {
			throw new FLException(260009, "货单不存在");
		}

		if (manifestPO.getStatus() != ManifestPO.STATUS_INIT_INT) {
			throw new FLException(260027, "货单状态不可操作");
		}

		short type = manifestVO.getType();

		long gid = manifestItemVO.getGoods().getGid();
		long cid = manifestItemVO.getColor().getCid();
		long fid = manifestItemVO.getFormat().getFid();

		int inprice = manifestItemVO.getInprice();
		int outprice = manifestItemVO.getOutprice();
		int num = manifestItemVO.getNum();

		ManifestItemPO manifestItemPO = new ManifestItemPO().init(manifestPO.getMid(), null, null, null, null, gid, cid, fid, manifestPO.getType(), inprice, outprice, num, null, null);

		if (type == 1 && manifestItemVO.getInstorehouse() != null) {
			manifestItemPO.setInstorehouse((goodsStorehouseStockService.instorehouse(gid, cid, fid, manifestItemVO.getInstorehouse().getShid(), num)));
		}

		if (type == 3 && manifestItemVO.getOutstorehouse() != null) {
			manifestItemPO.setOutstorehouse(goodsStorehouseStockService.outstorehouse(gid, cid, fid, manifestItemVO.getOutstorehouse().getShid(), num));
		}

		manifestItemPO.setComment(manifestItemVO.getComment());

		manifestItemDao.save(manifestItemPO);

		manifestItemVO.setMiid(manifestItemPO.getMiid());

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateManifestItem(ManifestVO manifestVO, ManifestItemVO manifestItemVO) throws FLException {

		ManifestPO manifestPO = manifestDao.get(manifestVO.getMid());

		if (manifestPO == null) {
			throw new FLException(260009, "货单不存在");
		}

		if (manifestPO.getStatus() != ManifestPO.STATUS_INIT_INT) {
			throw new FLException(260027, "货单状态不可操作");
		}

		ManifestItemPO manifestItemPO = manifestItemDao.get(manifestItemVO.getMiid());

		if (manifestItemPO == null) {
			throw new FLException(260010, "货单项不存在");
		}

		long gid = manifestItemPO.getGoods().getGid();
		long cid = manifestItemPO.getColor().getCid();
		long fid = manifestItemPO.getFormat().getFid();
		
		int surplus = manifestItemPO.getSurplus();
		int num = manifestItemVO.getNum();
		
		if(num > surplus){
			throw new FLException(260026, "货单项数量不符");
		}

		if (manifestItemPO.getInstorehouse() != null) {
			goodsStorehouseStockService.outstorehouse(gid, cid, fid, manifestItemPO.getInstorehouse().getShid(), surplus);
		}

		if (manifestItemPO.getOutstorehouse() != null) {
			goodsStorehouseStockService.instorehouse(gid, cid, fid, manifestItemPO.getOutstorehouse().getShid(), surplus);
		}
		
		manifestItemPO.setNum(num);
		manifestItemPO.setSurplus(num);

		if (manifestItemVO.getInstorehouse() != null) {
			manifestItemPO.setInstorehouse(goodsStorehouseStockService.instorehouse(gid, cid, fid, manifestItemVO.getInstorehouse().getShid(), num));
		}

		if (manifestItemVO.getOutstorehouse() != null) {
			manifestItemPO.setOutstorehouse(goodsStorehouseStockService.outstorehouse(gid, cid, fid, manifestItemVO.getOutstorehouse().getShid(), num));
		}
		
		manifestItemDao.update(manifestItemPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteManifestItem(ManifestVO manifestVO, ManifestItemVO manifestItemVO) throws FLException {

		ManifestPO manifestPO = manifestDao.get(manifestVO.getMid());

		if (manifestPO == null) {
			throw new FLException(260009, "货单不存在");
		}

		if (manifestPO.getStatus() != ManifestPO.STATUS_INIT_INT) {
			throw new FLException(260027, "货单状态不可操作");
		}

		ManifestItemPO manifestItemPO = manifestItemDao.get(manifestItemVO.getMiid());

		if (manifestItemPO == null) {
			throw new FLException(260010, "货单项不存在");
		}

		long gid = manifestItemPO.getGoods().getGid();
		long cid = manifestItemPO.getColor().getCid();
		long fid = manifestItemPO.getFormat().getFid();
		
		int surplus = manifestItemPO.getSurplus();

		if (manifestItemPO.getInstorehouse() != null) {
			goodsStorehouseStockService.outstorehouse(gid, cid, fid, manifestItemPO.getInstorehouse().getShid(), surplus);
		}

		if (manifestItemPO.getOutstorehouse() != null) {
			goodsStorehouseStockService.instorehouse(gid, cid, fid, manifestItemPO.getOutstorehouse().getShid(), surplus);
		}

		manifestItemDao.delete(manifestItemPO);

		return 0;
	}

}
