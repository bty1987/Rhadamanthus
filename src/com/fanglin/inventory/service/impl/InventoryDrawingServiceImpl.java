package com.fanglin.inventory.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.inventory.dao.InventoryDrawingDao;
import com.fanglin.inventory.po.InventoryDrawingPO;
import com.fanglin.inventory.service.InventoryDrawingService;
import com.fanglin.inventory.vo.InventoryDrawingVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("inventoryDrawingService")
@Transactional(readOnly = true)
public class InventoryDrawingServiceImpl implements InventoryDrawingService {

	@Autowired
	private InventoryDrawingDao inventoryDrawingDao;

	@Autowired
	private UserDao userDao;

	@Override
	public List<InventoryDrawingVO> queryInventoryDrawing(InventoryDrawingVO inventoryDrawingVO) {

		List<InventoryDrawingPO> inventoryDrawingPOs = inventoryDrawingDao.queryInventoryDrawing(inventoryDrawingVO.getSid());
		List<InventoryDrawingVO> inventoryDrawingVOs = new ArrayList<InventoryDrawingVO>();

		for (InventoryDrawingPO inventoryDrawingPO : inventoryDrawingPOs) {

			inventoryDrawingVO = new InventoryDrawingVO(new UserBaseVO());

			BeanUtil.copyProperties(inventoryDrawingPO, inventoryDrawingVO, Arrays.asList("creater"));

			inventoryDrawingVOs.add(inventoryDrawingVO);
		}

		return inventoryDrawingVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addInventoryDrawing(InventoryDrawingVO inventoryDrawingVO, String userId) throws FLException {

		InventoryDrawingPO inventoryDrawingPO = new InventoryDrawingPO();

		BeanUtil.copyProperties(inventoryDrawingVO, inventoryDrawingPO);

		inventoryDrawingPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		inventoryDrawingPO.setCreater(userDao.queryUserByUserId(userId));
		inventoryDrawingPO.setStatus(InventoryDrawingPO.STATUS_INIT_INT);

		inventoryDrawingDao.save(inventoryDrawingPO);

		inventoryDrawingVO.setIdid(inventoryDrawingPO.getIdid());

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteInventoryDrawing(InventoryDrawingVO inventoryDrawingVO) {

		inventoryDrawingDao.deleteInventoryDrawing(inventoryDrawingVO.getIdid());

		return 0;
	}

}
