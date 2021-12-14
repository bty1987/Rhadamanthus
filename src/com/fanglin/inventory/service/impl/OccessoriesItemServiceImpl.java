package com.fanglin.inventory.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.vo.WorkTypeVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.material.vo.AccessoriesTypeVO;
import com.fanglin.data.material.vo.GoodsVO;
import com.fanglin.inventory.dao.OccessoriesDao;
import com.fanglin.inventory.dao.OccessoriesItemDao;
import com.fanglin.inventory.po.OccessoriesItemPO;
import com.fanglin.inventory.po.OccessoriesPO;
import com.fanglin.inventory.service.OccessoriesItemService;
import com.fanglin.inventory.vo.OccessoriesItemVO;
import com.fanglin.inventory.vo.OccessoriesVO;
import com.fanglin.utils.BeanUtil;

@Service("occessoriesItemService")
@Transactional(readOnly = true)
public class OccessoriesItemServiceImpl implements OccessoriesItemService {

	@Autowired
	private OccessoriesItemDao occessoriesItemDao;
	
	@Autowired
	private OccessoriesDao occessoriesDao;
	
	@Override
	public List<OccessoriesItemVO> queryOccessoriesItemByAid(OccessoriesItemVO occessoriesItemVO) {
		
		List<OccessoriesItemPO> occessoriesItemPOs = occessoriesItemDao.queryOccessoriesItemByOid(occessoriesItemVO.getOid());
		List<OccessoriesItemVO> occessoriesItemVOs = new ArrayList<OccessoriesItemVO>();
		
		for(OccessoriesItemPO occessoriesItemPO : occessoriesItemPOs){
			
			occessoriesItemVO = new OccessoriesItemVO(new GoodsVO(new AccessoriesTypeVO(new WorkTypeVO())));
			
			BeanUtil.copyProperties(occessoriesItemPO, occessoriesItemVO, Arrays.asList("goods"));
			BeanUtil.copyProperties(occessoriesItemPO.getGoods(), occessoriesItemVO.getGoods(), Arrays.asList("accessoriesType"));
			
			if (occessoriesItemPO.getGoods().getAccessoriesType() != null) {

				BeanUtil.copyProperties(occessoriesItemPO.getGoods().getAccessoriesType(), occessoriesItemVO.getGoods().getAccessoriesType(), Arrays.asList("workType"));

				if (occessoriesItemPO.getGoods().getAccessoriesType().getWorkType() != null) {
					BeanUtil.copyProperties(occessoriesItemPO.getGoods().getAccessoriesType().getWorkType(), occessoriesItemVO.getGoods().getAccessoriesType().getWorkType());
				}
			}
			
			occessoriesItemVOs.add(occessoriesItemVO);
			
		}
		
		return occessoriesItemVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addOccessoriesItem(OccessoriesVO occessoriesVO, OccessoriesItemVO occessoriesItemVO) throws FLException {
		
		OccessoriesPO occessoriesPO = occessoriesDao.get(occessoriesVO.getOid());
		
		if(occessoriesPO == null){
			throw new FLException(260023, "辅料单不存在");
		}
		
		if (occessoriesPO.getStatus() != OccessoriesPO.STATUS_INIT_INT) {
			throw new FLException(260024, "辅料单状态不可操作");
		}
		
		OccessoriesItemPO occessoriesItemPO = new OccessoriesItemPO().init(occessoriesVO.getOid(), occessoriesItemVO.getGoods().getGid(), occessoriesItemVO.getNum());
		
		occessoriesItemDao.save(occessoriesItemPO);
		
		return 0;
	}
	
	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateOccessoriesItem(OccessoriesItemVO occessoriesItemVO) throws FLException {

		OccessoriesItemPO occessoriesItemPO = occessoriesItemDao.get(occessoriesItemVO.getOiid());
		
		if(occessoriesItemPO == null){
			throw new FLException(260025, "辅料单不存在");
		}
		
		OccessoriesPO occessoriesPO = occessoriesDao.get(occessoriesItemPO.getOid());
		
		if (occessoriesPO.getStatus() != OccessoriesPO.STATUS_INIT_INT) {
			throw new FLException(260024, "辅料单状态不可操作");
		}
		
		occessoriesItemPO.setNum(occessoriesItemVO.getNum());
		
		occessoriesItemDao.update(occessoriesItemPO);
		
		return 0;
	}
	
	@Override
	@Transactional(rollbackFor = Exception.class)
	public int refundOccessoriesItem(OccessoriesItemVO occessoriesItemVO) throws FLException {
		
		OccessoriesItemPO occessoriesItemPO = occessoriesItemDao.get(occessoriesItemVO.getOiid());
		
		if(occessoriesItemPO == null){
			throw new FLException(260025, "辅料单不存在");
		}
		
		OccessoriesPO occessoriesPO = occessoriesDao.get(occessoriesItemPO.getOid());
		
		if (occessoriesPO.getStatus() == OccessoriesPO.STATUS_INIT_INT) {
			throw new FLException(260024, "辅料单状态不可操作");
		}
		
		occessoriesItemPO.setRefnum(occessoriesItemVO.getRefnum());
		
		occessoriesItemDao.update(occessoriesItemPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteOccessoriesItem(OccessoriesItemVO occessoriesItemVO) throws FLException {

		OccessoriesItemPO occessoriesItemPO = occessoriesItemDao.get(occessoriesItemVO.getOiid());
		
		if(occessoriesItemPO == null){
			throw new FLException(260025, " 辅料项不存在");
		}
		
		OccessoriesPO occessoriesPO = occessoriesDao.get(occessoriesItemPO.getOid());
		
		if (occessoriesPO.getStatus() != OccessoriesPO.STATUS_INIT_INT) {
			throw new FLException(260024, "辅料单状态不可操作");
		}
		
		occessoriesItemDao.delete(occessoriesItemPO);
		
		return 0;
	}



}
