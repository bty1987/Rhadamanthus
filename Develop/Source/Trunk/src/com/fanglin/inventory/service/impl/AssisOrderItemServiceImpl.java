package com.fanglin.inventory.service.impl;

import java.util.ArrayList;
import java.util.Arrays;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.common.vo.WorkTypeVO;
import com.fanglin.inventory.dao.AssisOrderDao;
import com.fanglin.inventory.dao.AssisOrderItemDao;
import com.fanglin.inventory.po.AssisOrderItemPO;
import com.fanglin.inventory.po.AssisOrderPO;
import com.fanglin.inventory.po.ColorPO;
import com.fanglin.inventory.po.FormatPO;
import com.fanglin.inventory.po.GoodsPO;
import com.fanglin.inventory.service.AssisOrderItemService;
import com.fanglin.inventory.vo.AssisOrderItemVO;
import com.fanglin.inventory.vo.AssisOrderVO;
import com.fanglin.inventory.vo.AssisTypeVO;
import com.fanglin.inventory.vo.ColorVO;
import com.fanglin.inventory.vo.FormatVO;
import com.fanglin.inventory.vo.GoodsVO;
import com.fanglin.utils.BeanUtil;

@Service("assisOrderItemService")
@Transactional(readOnly = true)
public class AssisOrderItemServiceImpl implements AssisOrderItemService {

	@Autowired
	private AssisOrderItemDao assisOrderItemDao;

	@Autowired
	private AssisOrderDao assisOrderDao;

	@Override
	public List<AssisOrderItemVO> queryAssisOrderItemByAoid(AssisOrderItemVO assisOrderItemVO) {

		List<AssisOrderItemPO> assisOrderItemPOs = assisOrderItemDao.queryAssisOrderItemByAoid(assisOrderItemVO.getAoid());
		List<AssisOrderItemVO> assisOrderItemVOs = new ArrayList<AssisOrderItemVO>();

		for (AssisOrderItemPO assisOrderItemPO : assisOrderItemPOs) {

			assisOrderItemVO = new AssisOrderItemVO(new GoodsVO(new AssisTypeVO(new WorkTypeVO())),new ColorVO(),new FormatVO());

			BeanUtil.copyProperties(assisOrderItemPO, assisOrderItemVO,Arrays.asList("goods","color","format"));
			BeanUtil.copyProperties(assisOrderItemPO.getGoods(),assisOrderItemVO.getGoods(), Arrays.asList("assisType"));
			BeanUtil.copyProperties(assisOrderItemPO.getColor(),assisOrderItemVO.getColor());
			BeanUtil.copyProperties(assisOrderItemPO.getFormat(),assisOrderItemVO.getFormat());
			
			if(assisOrderItemPO.getGoods().getAssisType()!=null){
				
				BeanUtil.copyProperties(assisOrderItemPO.getGoods().getAssisType(), assisOrderItemVO.getGoods().getAssisType(),Arrays.asList("workType"));
				
				if(assisOrderItemPO.getGoods().getAssisType().getWorkType()!=null){
					
					BeanUtil.copyProperties(assisOrderItemPO.getGoods().getAssisType().getWorkType(), assisOrderItemVO.getGoods().getAssisType().getWorkType());
					
				}
			}
			
			

			assisOrderItemVOs.add(assisOrderItemVO);
		}

		return assisOrderItemVOs;
	}

	@Override
	public List<AssisOrderItemVO> queryAssisOrderItemByAoids(List<Long> aoids) {
		
		List<AssisOrderItemPO> assisOrderItemPOs = assisOrderItemDao.queryAssisOrderItemByAoids(aoids);
		List<AssisOrderItemVO> assisOrderItemVOs = new ArrayList<AssisOrderItemVO>();
		
		for (AssisOrderItemPO assisOrderItemPO : assisOrderItemPOs) {

			AssisOrderItemVO assisOrderItemVO = new AssisOrderItemVO(new GoodsVO(),new ColorVO(),new FormatVO());

			BeanUtil.copyProperties(assisOrderItemPO, assisOrderItemVO,Arrays.asList("goods","color","format"));
			BeanUtil.copyProperties(assisOrderItemPO.getGoods(),assisOrderItemVO.getGoods(), Arrays.asList("assisType"));
			BeanUtil.copyProperties(assisOrderItemPO.getColor(),assisOrderItemVO.getColor());
			BeanUtil.copyProperties(assisOrderItemPO.getFormat(),assisOrderItemVO.getFormat());

			assisOrderItemVOs.add(assisOrderItemVO);
		}

		return assisOrderItemVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addAssisOrderItem(AssisOrderVO assisOrderVO,AssisOrderItemVO assisOrderItemVO) throws FLException {

		AssisOrderPO assisOrderPO = assisOrderDao.get(assisOrderVO.getAoid());

		if (assisOrderPO == null) {
			throw new FLException(260023, "辅料单不存在");
		}

		short stutas = assisOrderPO.getStatus();

		if (stutas != 0) {
			throw new FLException(260024, "辅料单状态不可操作");
		}

		AssisOrderItemPO assisOrderItemPO;

		assisOrderItemPO = new AssisOrderItemPO(new GoodsPO(),new ColorPO(),new FormatPO());

		BeanUtil.copyProperties(assisOrderItemVO, assisOrderItemPO,Arrays.asList("goods","color","format"));
		BeanUtil.copyProperties(assisOrderItemVO.getGoods(),assisOrderItemPO.getGoods(), Arrays.asList("assisType"));
		BeanUtil.copyProperties(assisOrderItemVO.getColor(),assisOrderItemPO.getColor());
		BeanUtil.copyProperties(assisOrderItemVO.getFormat(),assisOrderItemPO.getFormat());

		assisOrderItemPO.setNum(assisOrderItemVO.getNum());
		assisOrderItemPO.setAoid(assisOrderVO.getAoid());

		assisOrderItemDao.save(assisOrderItemPO);

		assisOrderItemVO.setAoiid(assisOrderItemPO.getAoiid());

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateAssisOrderItem(AssisOrderVO assisOrderVO,AssisOrderItemVO assisOrderItemVO) throws FLException {

		AssisOrderPO assisOrderPO = assisOrderDao.get(assisOrderVO.getAoid());

		short stutas = assisOrderPO.getStatus();

		if (stutas != 0) {
			throw new FLException(260024, "辅料单状态不可操作");
		}

		AssisOrderItemPO assisOrderItemPO = assisOrderItemDao.get(assisOrderItemVO.getAoiid());

		if (assisOrderItemPO == null) {
			throw new FLException(260025, "辅料项不存在");
		}
		
		assisOrderItemPO.setNum(assisOrderItemVO.getNum());

		assisOrderItemDao.update(assisOrderItemPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteAssisOrderItem(AssisOrderVO assisOrderVO,AssisOrderItemVO assisOrderItemVO) throws FLException {

		AssisOrderPO assisOrderPO = assisOrderDao.get(assisOrderVO.getAoid());

		short stutas = assisOrderPO.getStatus();

		if (stutas != 0) {
			throw new FLException(260024, "辅料单状态不可操作");
		}

		AssisOrderItemPO assisOrderItemPO = assisOrderItemDao.get(assisOrderItemVO.getAoiid());

		if (assisOrderItemPO == null) {
			throw new FLException(260025, "辅料项不存在");
		}

		assisOrderItemDao.delete(assisOrderItemPO);

		return 0;
	}

}
