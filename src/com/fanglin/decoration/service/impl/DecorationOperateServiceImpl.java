/**
 * @File Name		: DecorationOperateServiceImpl.java
 * @Package   	: com.fanglin.decoration.service.impl
 * @Version		: 1.0
 * @Date			: 2016-10-31
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.decoration.service.impl;

import java.util.Date;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.decoration.dao.DecorationOperateDao;
import com.fanglin.decoration.po.DecorationBelongPO;
import com.fanglin.decoration.po.DecorationOperatePO;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.decoration.service.DecorationOperateService;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.DateUtil;

@Service("decorationOperateService")
@Transactional(readOnly=true)
public class DecorationOperateServiceImpl implements DecorationOperateService {
	
	@Transactional(rollbackFor=Exception.class)
	public int makeDecorationOperateForDecorationBelong(){
		
		
		
		return 0;
	}
	
	@Transactional(rollbackFor=Exception.class)
	public static int makeDecorationOperateForDecorationContract(DecorationOperateDao decorationOperateDao, DecorationPO decorationPO, List<DecorationBelongPO> salesmans, List<DecorationBelongPO> designers, UserPO operater, float value, int flag, short type){
		
		for(DecorationBelongPO salesman: salesmans){
			for(DecorationBelongPO designer: designers){
				
				DecorationOperatePO decorationOperatePO = new DecorationOperatePO();
				decorationOperatePO.setOrderId(decorationPO.getOrderId());
				decorationOperatePO.setDsuid(salesman.getBelonger().getUid());
				decorationOperatePO.setSmuid(designer.getBelonger().getUid());
				decorationOperatePO.setOperater(operater);
				decorationOperatePO.setOperateTime(DateUtil.getDateToTimestamp(new Date()));
				decorationOperatePO.setStatus(DecorationOperatePO.STATUS_DISABLED_INT);
				decorationOperatePO.setComment("签订合同");
				decorationOperatePO.setValue(Arith.mul(flag, Arith.mul(Arith.mul(salesman.getRate(), designer.getRate()), value)));
				decorationOperatePO.setType(type);
				
				decorationOperatePO.setDsdid(designer.getBelonger().getDept().getDid());
				decorationOperatePO.setDsrid(designer.getBelonger().getDept().getFatherDept().getDid());
				decorationOperatePO.setSmdid(salesman.getBelonger().getDept().getDid());
				decorationOperatePO.setSmrid(salesman.getBelonger().getDept().getFatherDept().getDid());
				
				decorationOperatePO.setDrate(designer.getRate());
				decorationOperatePO.setSrate(salesman.getRate());
				
				decorationOperateDao.save(decorationOperatePO);
			}
		}
		
		return 0;
	}

}
