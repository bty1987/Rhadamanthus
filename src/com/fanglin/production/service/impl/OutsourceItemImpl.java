package com.fanglin.production.service.impl;

import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.production.dao.OutsourceDao;
import com.fanglin.production.dao.OutsourceItemDao;
import com.fanglin.production.po.OutsourceItemPO;
import com.fanglin.production.po.OutsourcePO;
import com.fanglin.production.service.OutsourceItemService;
import com.fanglin.production.vo.OutsourceItemVO;
import com.fanglin.production.vo.OutsourceVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("outsourceItemService")
@Transactional(readOnly = true)
public class OutsourceItemImpl implements OutsourceItemService{

	@Autowired
	private OutsourceItemDao outsourceItemDao;
	
	@Autowired
	private OutsourceDao  outsourceDao;
	
	@Override
	public void pageOutsourceItemByOid(Paging paging, List<Filter> filters ,OutsourceItemVO outsourceItemVO) {
		
		List<OutsourceItemPO> outsourceItemPOs = outsourceItemDao.pageoutsourceItem(paging, filters, outsourceItemVO.getOid());
		List<OutsourceItemVO> outsourceItemVOs = new ArrayList<OutsourceItemVO>();
		
		OutsourceItemVO outsourceItemVo;
		
		for(OutsourceItemPO outsourceItemPO: outsourceItemPOs){
			
			 outsourceItemVo = new OutsourceItemVO();
			
			BeanUtil.copyProperties(outsourceItemPO, outsourceItemVo);
			
			outsourceItemVOs.add(outsourceItemVo);
		}
		
		paging.setData(outsourceItemVOs);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addOutsourceItem(List<OutsourceItemVO> outsourceItems,OutsourceVO outsource) throws FLException {
		
		OutsourcePO  outsourcePO = (OutsourcePO)outsourceDao.get(outsource.getOid());
		
		    if (outsourcePO == null) {
		      throw new FLException(220004, "外协单不存在");
		    }
		    for (OutsourceItemVO outsourceItemVO : outsourceItems)
		    {
		    	OutsourceItemPO OutsourceItemPO = new OutsourceItemPO();
		      
		      BeanUtil.copyProperties(outsourceItemVO, OutsourceItemPO);
		      OutsourceItemPO.setOid(outsource.getOid());
		      
		      outsourceDao.save(OutsourceItemPO);
		    }
		
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteOutsourceItem(OutsourceItemVO outsourceItem) throws FLException {
		
		OutsourceItemPO	 outsourceItemPO = outsourceItemDao.get(outsourceItem.getOiid());
		
		if (outsourceItemPO == null){
			throw new FLException(220006, "外协单不存在");
		}
		outsourceItemDao.delete(outsourceItemPO);
		
		return 0;
	}

}
