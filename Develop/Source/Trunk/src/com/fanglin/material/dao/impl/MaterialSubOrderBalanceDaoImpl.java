/**
 * @File Name		: MaterialSubOrderPreBalanceDaoImpl.java
 * @Package   	: com.fanglin.dao.materialOrder.impl
 * @Version		: 1.0
 * @Date			: 2015-4-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.material.dao.impl;

import java.sql.Timestamp;
import java.util.Date;
import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.material.dao.MaterialSubOrderBalanceDao;
import com.fanglin.material.po.MaterialSubOrderBalancePO;
import com.fanglin.material.po.MaterialSubOrderPO;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Repository("materialSubOrderBalanceDao")
public class MaterialSubOrderBalanceDaoImpl extends DaoImpl<MaterialSubOrderBalancePO> implements MaterialSubOrderBalanceDao {
	
	public MaterialSubOrderBalanceDaoImpl(){
		super(MaterialSubOrderBalancePO.class);
	}

	@Override
	public List<MaterialSubOrderBalancePO> pageMaterialSubOrderBalance(Paging paging, List<FilterVO> filters) {
		
		PagingQuery<MaterialSubOrderBalancePO> query = pagingQuery(paging, MaterialSubOrderBalancePO.class);
		
		queryFilterExecute(query, filters);
		
		return query.list();
	}
	
	private void queryFilterExecute(PagingQuery<?> query, List<FilterVO> filters){
		
		query.alias("materialSubOrder", "materialSubOrder");
		
		for(FilterVO filter: filters){
			if(MaterialSubOrderPO.COLUMN_MSONO_STR.equals(filter.getField())){
				query.add(Restrictions.eq(MaterialSubOrderBalancePO.COLUMN_MSONO_STR, filter.getData()));
			}else if(MaterialSubOrderPO.COLUMN_ORDERID_STR.equals(filter.getField())){
				query.add(Restrictions.eq(MaterialSubOrderBalancePO.COLUMN_ORDERID_STR, filter.getData()));
			}else if(MaterialSubOrderPO.COLUMN_INSTOREID_STR.equals(filter.getField())){
				query.alias("instorer", "instorer");
				query.add(Restrictions.eq(MaterialSubOrderBalancePO.COLUMN_INSTOREID_STR, filter.getData()));
			}else if(MaterialSubOrderBalancePO.COLUMN_TYPE_STR.equals(filter.getField())){
				query.add(query.getCriterion(MaterialSubOrderBalancePO.COLUMN_TYPE_STR, Short.parseShort(filter.getData()), filter.getOp()));
			}else if(MaterialSubOrderBalancePO.COLUMN_STATUS_STR.equals(filter.getField())){
				query.add(query.getCriterion(MaterialSubOrderBalancePO.COLUMN_STATUS_STR, Short.parseShort(filter.getData()), filter.getOp()));
			}else if(MaterialSubOrderPO.COLUMN_FULLCOLLECTTIME_RANGE_STR.equals(filter.getField())){
				
				String data = filter.getData();
				
				String sTime = data.split("-")[0].replaceAll("/", "-") + " 00:00:00";
				String eTime = data.split("-")[1].replaceAll("/", "-") + " 23:59:59";
				
				Date sDate = DateUtil.parseDate(sTime, "yyyy-MM-dd HH:mm:ss");
				Date eDate = DateUtil.parseDate(eTime, "yyyy-MM-dd HH:mm:ss");
				
				Timestamp sTimestamp = DateUtil.getDateToTimestamp(sDate);
				Timestamp eTimestamp = DateUtil.getDateToTimestamp(eDate);
				
				query.add(query.getCriterion(MaterialSubOrderBalancePO.COLUMN_FULLCOLLECTTIME_STR, eTimestamp, "le"));
				query.add(query.getCriterion(MaterialSubOrderBalancePO.COLUMN_FULLCOLLECTTIME_STR, sTimestamp, "ge"));
			}
		}
	}
	
}
