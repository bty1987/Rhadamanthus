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
import com.fanglin.decoration.po.DecorationBelongInfoPO;
import com.fanglin.decoration.po.DecorationOperatePO;
import com.fanglin.decoration.po.DecorationOrderPO;
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
	public static int makeDecorationOperateForDecorationContract(DecorationOperateDao decorationOperateDao, DecorationOrderPO decorationOrderPO, List<DecorationBelongInfoPO> salesmans, List<DecorationBelongInfoPO> designers, String userId, float value, int flag, short type){
		
		for(DecorationBelongInfoPO salesman: salesmans){
			for(DecorationBelongInfoPO designer: designers){
				
				DecorationOperatePO decorationOperatePO = new DecorationOperatePO();
				decorationOperatePO.setDecorationOrder(decorationOrderPO);
				decorationOperatePO.setSourcer(salesman.getBelongUserPO());
				decorationOperatePO.setTarger(designer.getBelongUserPO());
				decorationOperatePO.setOperater(new UserPO(userId));
				decorationOperatePO.setOperateTime(DateUtil.getDateToTimestamp(new Date()));
				decorationOperatePO.setStatus(DecorationOperatePO.STATUS_DISABLED_INT);
				decorationOperatePO.setDes("签订合同");
				decorationOperatePO.setValue(Arith.mul(flag, Arith.mul(Arith.mul(salesman.getBelongRate(), designer.getBelongRate()), value)));
				decorationOperatePO.setType(type);
				
				decorationOperateDao.save(decorationOperatePO);
			}
		}
		
		return 0;
	}

}
