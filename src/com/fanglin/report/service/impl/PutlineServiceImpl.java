package com.fanglin.report.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.quotation.dao.QuotationDao;
import com.fanglin.quotation.po.QuotationPO;
import com.fanglin.report.dao.PutlineDao;
import com.fanglin.report.po.PutlinePO;
import com.fanglin.report.service.PutlineService;
import com.fanglin.report.vo.PutlineVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("putlineService")
@Transactional(readOnly=true)
public class PutlineServiceImpl implements PutlineService {

	@Autowired
	private PutlineDao putlineDao;
	
	@Autowired
	private QuotationDao quotationDao;
	
	@Override
	public void pagePutline(Paging paging, List<Filter> filters) {
		List<PutlinePO> putlinePOs = putlineDao.pagePutline(paging, filters);
		List<PutlineVO> putlineVOs = new ArrayList<PutlineVO>();
		
		for(PutlinePO putlinePO : putlinePOs){

			PutlineVO putlineVO = new PutlineVO();
			BeanUtil.copyProperties(putlinePO, putlineVO, Arrays.asList("decoration"));
			DecorationVO decorationOrderVO = decorationOrderPOToVO(putlinePO.getDecoration());
			putlineVO.setDecorationOrder(decorationOrderVO);
			putlineVOs.add(putlineVO);
		}
		
		paging.setData(putlineVOs);
	}
	
	private DecorationVO decorationOrderPOToVO(DecorationPO decorationPO){
		
		DecorationVO decorationVO = new DecorationVO();
		
		decorationPO.ptvcascade(decorationVO);
		
		QuotationPO quotationPO = quotationDao.queryQuotationForDefaultByOrderId(decorationPO.getOrderId());
		
		if(decorationVO.getOrderTotalPrice() == null || decorationVO.getOrderTotalPrice() == 0){
			if(quotationPO == null){
				decorationVO.setOrderTotalPrice(0f);
				decorationVO.setDiscount(0f);
			}else{
				decorationVO.setOrderTotalPrice(quotationPO.getTotalPrice());
				decorationVO.setDiscount(quotationPO.getDiscount());
			}
		}
		
		if(quotationPO == null){
			decorationVO.setDiscount(0f);
		}else{
			decorationVO.setDiscount(quotationPO.getDiscount());
		}
		
		
		BeanUtil.copyProperties(decorationPO.getHouse(), decorationVO.getHouse(), Arrays.asList("cityProper"));	
				
		decorationVO.setSupervisor(new UserBaseVO());
		
		
		UserPO designer = decorationPO.getDesigner();
		
		decorationVO.getDesigner().setUserName(designer.getUserName());
		decorationVO.getDesigner().setUserId(designer.getUserId());
		decorationVO.getDesigner().setPhone(designer.getPhone());
		decorationVO.getDesigner().getDept().setDeptName(designer.getDept().getDeptName());
		
		UserPO salesman = decorationPO.getSalesman();
		decorationVO.setSalesman(new UserBaseVO());
		
		decorationVO.getSalesman().setUserName(salesman.getUserName());
		decorationVO.getSalesman().setUserId(salesman.getUserId());
		decorationVO.getSalesman().setPhone(salesman.getPhone());
		decorationVO.getSalesman().getDept().setDeptName(salesman.getDept().getDeptName());
			
		return decorationVO;
	}

}
