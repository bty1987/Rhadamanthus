package com.fanglin.store.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.vo.Filter;
import com.fanglin.store.dao.EvaluateDao;
import com.fanglin.store.dao.MpriceDao;
import com.fanglin.store.po.EvaluatePO;
import com.fanglin.store.po.MgoodsPO;
import com.fanglin.store.po.MpricePO;
import com.fanglin.store.service.EvaluateService;
import com.fanglin.store.vo.EvaluateVO;
import com.fanglin.store.vo.McolorVO;
import com.fanglin.store.vo.MformatVO;
import com.fanglin.store.vo.MgoodsVO;
import com.fanglin.store.vo.MpriceVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("evaluateService")
@Transactional(readOnly=true)
public class EvaluateServiceImpl implements EvaluateService{

	@Autowired
	private EvaluateDao evaluateDao;
	
	@Autowired
	private MpriceDao mpriceDao;
	
	@Override
	public void pageEvaluate (Paging paging, List<Filter> filters) {
	
		ArrayList<Long> pids = new ArrayList<Long>();
		 
		if ((filters.get(0)).getField().equals(MgoodsPO.COLUMN_GID_STR)){
			
			List<MpricePO> mpricePOs =mpriceDao.queryMpriceByGid(Long.valueOf((filters.get(0)).getData()));
		      
		    for (MpricePO mpricePO : mpricePOs) {
		    	
		    	pids.add(mpricePO.getPid());
			
		    }      
		}
		
		List<EvaluatePO> evaluatePOs = evaluateDao.pageEvaluate(paging, filters, pids);
		List<EvaluateVO> evaluateVOs = new ArrayList<EvaluateVO>();
				
		for (EvaluatePO evaluatePO : evaluatePOs) {
			
			EvaluateVO evaluateVO = new EvaluateVO(new MpriceVO(new MgoodsVO(), new McolorVO(), new MformatVO()));
			
			BeanUtil.copyProperties(evaluatePO, evaluateVO, Arrays.asList("mprice"));
			
			BeanUtil.copyProperties(evaluatePO.getMprice(), evaluateVO.getMprice(), Arrays.asList("mgoods", "mcolor", "mformat"));
			
			BeanUtil.copyProperties(evaluatePO.getMprice().getMgoods(), evaluateVO.getMprice().getMgoods(), Arrays.asList("mbrand"));
			
			BeanUtil.copyProperties(evaluatePO.getMprice().getMcolor(), evaluateVO.getMprice().getMcolor());
			
			BeanUtil.copyProperties(evaluatePO.getMprice().getMformat(), evaluateVO.getMprice().getMformat());
			
			evaluateVOs.add(evaluateVO);
			
		}
		
		paging.setData(evaluateVOs);
		
	}
	
	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addEvaluate (List<EvaluateVO> evaluates){
		
		for (EvaluateVO evaluateVO : evaluates) {
			
			MpricePO mpricePO = mpriceDao.queryMpriceByPid(evaluateVO.getMprice().getPid());
			
			EvaluatePO evaluatePO = new EvaluatePO(mpricePO);
			
			BeanUtil.copyProperties(evaluateVO, evaluatePO, Arrays.asList("mprice"));
			
			evaluatePO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
			
			evaluateDao.save(evaluatePO);
			
		}
	}
}
