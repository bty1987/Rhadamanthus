/**
 * @File Name		: MaterialPreBalanceDaoImpl.java
 * @Package   	: com.fanglin.dao.materialOrder.impl
 * @Version		: 1.0
 * @Date			: 2015-4-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.material.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.material.dao.MaterialBalanceDao;
import com.fanglin.material.po.MaterialBalancePO;
import com.fanglin.material.po.MaterialPO;
import com.fanglin.utils.Paging;

@Repository("materialBalanceDao")
public class MaterialBalanceDaoImpl extends DaoImpl<MaterialBalancePO> implements MaterialBalanceDao {

	public MaterialBalanceDaoImpl() {
		super(MaterialBalancePO.class);
	}

	@Override
	public List<MaterialBalancePO> pageMaterialBalance(Paging paging, List<Filter> filters, int company) {

		PagingQuery<MaterialBalancePO> query = pagingQuery(paging, MaterialBalancePO.class);

		query.add(query.getCriterion("material.company", company, "eq"));

		queryFilterExecute(query, filters);

		return query.list();
	}

	private void queryFilterExecute(PagingQuery<?> query, List<Filter> filters) {

		query.alias("material", "material");

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if (MaterialPO.COLUMN_NO_STR.equals(field)) {
				query.add(Restrictions.eq(MaterialBalancePO.COLUMN_MSONO_STR, data));
			} else if (MaterialPO.COLUMN_ORDERID_STR.equals(field)) {
				query.add(Restrictions.eq(MaterialBalancePO.COLUMN_ORDERID_STR, data));
			} else if (MaterialPO.COLUMN_INSTOREID_STR.equals(field)) {
				query.alias("instorer", "instorer");
				query.add(Restrictions.eq(MaterialBalancePO.COLUMN_INSTOREID_STR, data));
			} else if (MaterialBalancePO.COLUMN_TYPE_STR.equals(field)) {// 根据类型查询
				query.add(query.getCriterion(MaterialBalancePO.COLUMN_TYPE_STR, Short.parseShort(data), op));
			} else if (MaterialBalancePO.COLUMN_STATUS_STR.equals(field)) {
				query.add(query.getCriterion(MaterialBalancePO.COLUMN_STATUS_STR, Short.parseShort(data), op));
			} else if (MaterialPO.COLUMN_MATERIALBRAND_STR.equals(field)) {// 增加品牌模糊查询
				query.add(query.getCriterion(MaterialBalancePO.COLUMN_MATERIALBRAND_STR, data, op));
			} else if (MaterialPO.COLUMN_VILLAGE_ID_STR.equals(field)) {// 增加楼盘地址模糊查询
				query.alias("material.house", "house");
				query.alias("house.village", "village");
				query.add(query.getCriterion("village.no", data, op));
			} else if (MaterialPO.COLUMN_REGIONID_STR.equals(field)) {// 增加归属大区名字模糊查询
				query.alias("material.region", "region");
				query.add(Restrictions.eq("region.name", data));
			} else if (MaterialPO.COLUMN_DEPARTMENTID_STR.equals(field)) {// 增加业务大区名字模糊查询
				query.alias("material.department", "department");
				query.add(Restrictions.eq("department.name", data));
			} else if (MaterialPO.COLUMN_FULLCOLLECTTIME_RANGE_STR.equals(field)) {
				query.timeranges(MaterialBalancePO.COLUMN_FULLPAYTIME_STR, data);
			} else if (MaterialPO.COLUMN_PREBALANCETIME_RANGE_STR.equals(field)) {
				query.timeranges(MaterialBalancePO.COLUMN_PREBALANCETIME_STR, data);
			} else if (MaterialPO.COLUMN_POSTBALANCETIME_RANGE_STR.equals(field)) {
				query.timeranges(MaterialBalancePO.COLUMN_POSTBALANCETIME_STR, data);
			} else if (MaterialPO.COLUMN_VBALANCETIME_RANGE_STR.equals(field)) {
				query.timeranges(MaterialBalancePO.COLUMN_VBALANCETIME_STR, data);
			}
		}
	}
}
