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
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.inventory.dao.ManifestDao;
import com.fanglin.inventory.dao.ManifestItemDao;
import com.fanglin.inventory.po.ColorPO;
import com.fanglin.inventory.po.FormatPO;
import com.fanglin.inventory.po.GoodsPO;
import com.fanglin.inventory.po.ManifestItemPO;
import com.fanglin.inventory.po.ManifestPO;
import com.fanglin.inventory.service.GoodsStorehouseStockService;
import com.fanglin.inventory.service.ManifestItemService;
import com.fanglin.inventory.service.StorehouseStockService;
import com.fanglin.inventory.vo.ColorVO;
import com.fanglin.inventory.vo.FormatVO;
import com.fanglin.inventory.vo.GoodsVO;
import com.fanglin.inventory.vo.ManifestItemVO;
import com.fanglin.inventory.vo.ManifestVO;
import com.fanglin.inventory.vo.StorehouseVO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("manifestItemService")
@Transactional(readOnly = true)
public class ManifestItemServiceImpl implements ManifestItemService {

	@Autowired
	private ManifestDao manifestDao;

	@Autowired
	private ManifestItemDao manifestItemDao;

	@Autowired
	private GoodsStorehouseStockService goodsStorehouseStockService;

	@Autowired
	private StorehouseStockService storehouseStockService;

	@Override
	public List<ManifestItemVO> queryManifestItemByMId(ManifestVO manifestVO) {

		List<ManifestItemPO> manifestItemPOs = manifestItemDao
				.queryManifestItemByMId(manifestVO.getMid());
		List<ManifestItemVO> manifestItemVOs = new ArrayList<ManifestItemVO>();

		ManifestItemVO manifestItemVO;

		for (ManifestItemPO manifestItemPO : manifestItemPOs) {

			manifestItemVO = new ManifestItemVO(new GoodsVO(), new ColorVO(),
					new FormatVO(), new StorehouseVO(), new StorehouseVO());

			BeanUtil.copyProperties(manifestItemPO, manifestItemVO, Arrays
					.asList("goods", "color", "format", "instorehouse",
							"outstorehouse"));
			BeanUtil.copyProperties(manifestItemPO.getGoods(),
					manifestItemVO.getGoods(), Arrays.asList("assisType"));
			BeanUtil.copyProperties(manifestItemPO.getColor(),
					manifestItemVO.getColor());
			BeanUtil.copyProperties(manifestItemPO.getFormat(),
					manifestItemVO.getFormat());
			BeanUtil.copyProperties(manifestItemPO.getInstorehouse(),
					manifestItemVO.getInstorehouse());
			BeanUtil.copyProperties(manifestItemPO.getOutstorehouse(),
					manifestItemVO.getOutstorehouse());

			manifestItemVOs.add(manifestItemVO);
		}

		return manifestItemVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addManifestItemForCGAndXG(ManifestVO manifestVO,
			ManifestItemVO manifestItemVO) throws FLException {

		ManifestPO manifestPO = manifestDao.get(manifestVO.getMid());

		if (manifestPO == null) {
			throw new FLException(260009, "货单不存在");
		}

		short stutas = manifestPO.getStatus();

		if (stutas != 0) {
			throw new FLException(260027, "货单状态不可操作");
		}

		float total = 0f;
		String comment = "";
		String month = DateUtil.getDateToDateString(new Date(), "yyyyMM");
		short type = manifestVO.getType();

		ManifestItemPO manifestItemPO = new ManifestItemPO(new GoodsPO(),
				new ColorPO(), new FormatPO());

		long gid = manifestItemVO.getGoods().getGid();
		long cid = manifestItemVO.getColor().getCid();
		long fid = manifestItemVO.getFormat().getFid();
		float num = manifestItemVO.getNum();

		BeanUtil.copyProperties(manifestItemVO, manifestItemPO, Arrays.asList(
				"goods", "color", "format", "instorehouse", "outstorehouse"));
		BeanUtil.copyProperties(manifestItemVO.getGoods(),
				manifestItemPO.getGoods(), Arrays.asList("assisType"));
		BeanUtil.copyProperties(manifestItemVO.getColor(),
				manifestItemPO.getColor());
		BeanUtil.copyProperties(manifestItemVO.getFormat(),
				manifestItemPO.getFormat());

		if (type == 1 && manifestItemVO.getInstorehouse() != null) {
			long ishId = manifestItemVO.getInstorehouse().getShId();

			manifestItemPO.setInstorehouse(goodsStorehouseStockService
					.instorehouse(gid, cid, fid, ishId, num));
			storehouseStockService.updateStorehouseStock(ishId, month, num);

			total = Arith.add(total, manifestItemPO.getPurchasePrice());
		}
		if (type == 3 && manifestItemVO.getOutstorehouse() != null) {
			long oshId = manifestItemVO.getOutstorehouse().getShId();

			manifestItemPO.setOutstorehouse(goodsStorehouseStockService
					.outstorehouse(gid, cid, fid, oshId, num));
			storehouseStockService.updateStorehouseStock(oshId, month, -num);

			total = Arith.sub(total, manifestItemPO.getPurchasePrice());
		}

		manifestItemPO.setPurchasePrice(manifestItemVO.getPurchasePrice());
		manifestItemPO.setNum(manifestItemVO.getNum());
		manifestItemPO.setMid(manifestVO.getMid());
		manifestItemPO.setComment(manifestItemVO.getComment());

		manifestPO.setTotal(total);
		manifestPO.setComment(comment);

		manifestItemDao.save(manifestItemPO);

		manifestItemVO.setMiId(manifestItemPO.getMiId());

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateManifestItem(ManifestVO manifestVO,ManifestItemVO manifestItemVO) throws FLException {

		ManifestPO manifestPO = manifestDao.get(manifestVO.getMid());

		if (manifestPO == null) {
			throw new FLException(260009, "货单不存在");
		}

		ManifestItemPO manifestItemPO = manifestItemDao.get(manifestItemVO
				.getMiId());

		if (manifestItemPO == null) {
			throw new FLException(260010, "货单项不存在");
		}

		long gid = manifestItemPO.getGoods().getGid();
		long cid = manifestItemPO.getColor().getCid();
		long fid = manifestItemPO.getFormat().getFid();
		float num = manifestItemPO.getNum();
		String month = DateUtil.getDateToDateString(new Date(), "yyyyMM");

		if (manifestItemPO.getInstorehouse() != null) {

			long shId = manifestItemPO.getInstorehouse().getShId();

			goodsStorehouseStockService.outstorehouse(gid, cid, fid, shId, num);
			storehouseStockService.updateStorehouseStock(shId, month, num);
		}

		if (manifestItemPO.getOutstorehouse() != null) {

			long shId = manifestItemPO.getOutstorehouse().getShId();

			goodsStorehouseStockService.instorehouse(gid, cid, fid, shId, num);
			storehouseStockService.updateStorehouseStock(shId, month, -num);
		}

		manifestPO.setTotal(Arith.sub(manifestPO.getTotal(),Arith.sub(manifestItemPO.getPurchasePrice(),manifestItemVO.getPurchasePrice())));

		BeanUtil.copyProperties(manifestItemVO, manifestItemPO,Arrays.asList("instorehouse", "outstorehouse"));

		num = manifestItemVO.getNum();

		if (manifestItemVO.getInstorehouse() != null) {

			long shId = manifestItemVO.getInstorehouse().getShId();

			manifestItemPO.setInstorehouse(goodsStorehouseStockService.instorehouse(gid, cid, fid, shId, num));
			storehouseStockService.updateStorehouseStock(shId, month, num);
		}

		if (manifestItemVO.getOutstorehouse() != null) {

			long shId = manifestItemVO.getOutstorehouse().getShId();

			manifestItemPO.setOutstorehouse(goodsStorehouseStockService.outstorehouse(gid, cid, fid, shId, num));
			storehouseStockService.updateStorehouseStock(shId, month, -num);
		}

		manifestItemDao.update(manifestItemPO);
		manifestDao.update(manifestPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteManifestItem(ManifestVO manifestVO,
			ManifestItemVO manifestItemVO) throws FLException {

		ManifestPO manifestPO = manifestDao.get(manifestVO.getMid());

		if (manifestPO == null) {
			throw new FLException(260009, "货单不存在");
		}

		ManifestItemPO manifestItemPO = manifestItemDao.get(manifestItemVO
				.getMiId());

		if (manifestItemPO == null) {
			throw new FLException(260010, "货单项不存在");
		}

		long gid = manifestItemPO.getGoods().getGid();
		long cid = manifestItemPO.getColor().getCid();
		long fid = manifestItemPO.getFormat().getFid();
		float num = manifestItemPO.getNum();
		String month = DateUtil.getDateToDateString(new Date(), "yyyyMM");

		if (manifestItemPO.getInstorehouse() != null) {

			long shId = manifestItemPO.getInstorehouse().getShId();

			goodsStorehouseStockService.outstorehouse(gid, cid, fid, shId, num);
			storehouseStockService.updateStorehouseStock(shId, month, num);
		}

		if (manifestItemPO.getOutstorehouse() != null) {

			long shId = manifestItemPO.getOutstorehouse().getShId();

			goodsStorehouseStockService.instorehouse(gid, cid, fid, shId, num);
			storehouseStockService.updateStorehouseStock(shId, month, -num);
		}

		manifestPO.setTotal(Arith.sub(manifestPO.getTotal(),
				manifestItemPO.getPurchasePrice()));

		manifestItemDao.delete(manifestItemPO);
		manifestDao.update(manifestPO);

		return 0;
	}

}
