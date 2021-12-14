package com.fanglin.kingdee.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.inventory.po.ManifestPO;
import com.fanglin.inventory.vo.ManifestItemVO;
import com.fanglin.kingdee.handle.Dao;
import com.fanglin.kingdee.ko.OtherOutStockBillItemKO;
import com.fanglin.kingdee.ko.OtherOutStockBillKO;
import com.fanglin.kingdee.service.ActivityOutStockKingdeeService;
import com.fanglin.utils.SystemConfig;

@Service("activityOutStockKingdeeService")
@Transactional(readOnly = true)
public class ActivityOutStockKingdeeServiceImpl implements ActivityOutStockKingdeeService {

	@Autowired
	private CustomerServiceImpl customerServiceImpl;
	
	@Autowired
	private Dao dao;
	
	@Override
	public void out(ManifestPO manifestPO, List<ManifestItemVO> manifestItemVOs) throws FLException {
		
		if (SystemConfig.getString("KINGDEEENABLE") == null || SystemConfig.getString("KINGDEEENABLE").equals("false")) return;
		
		if (manifestPO.getType() != ManifestPO.TYPE_XG_INT) return;
		
		List<OtherOutStockBillItemKO> item = new ArrayList<OtherOutStockBillItemKO>();
				
		for (ManifestItemVO manifestItemVO : manifestItemVOs) {
			
			item.add(new OtherOutStockBillItemKO().ptk(".0009", manifestItemVO.getNum(), "CK003"));
		}
		
		//保存客户 TODO 客户名称
		customerServiceImpl.audit(manifestPO.getCode(), manifestPO.getCode());
		
		dao.save(new OtherOutStockBillKO().ptk(manifestPO.getCreateTime().toString(), "100.01", "QTCKD01_SYS", manifestPO.getCode(), item));
		
	}

}
