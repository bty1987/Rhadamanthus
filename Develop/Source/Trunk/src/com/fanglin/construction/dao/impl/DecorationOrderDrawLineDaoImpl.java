/**
 * @File Name		: DecorationOrderDrawLineDaoImpl
 * @Package   	: com.fanglin.dao
 * @Version		: 1.0
 * @Date			: 2014-9-21
 * @Copyright	: Copyright Creators 2014
 * @Author		:  bty1987
 * @Email			: 
 * @Describing	: 
 */

package com.fanglin.construction.dao.impl;

import java.sql.Timestamp;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.construction.dao.DecorationOrderDrawLineDao;
import com.fanglin.construction.po.DecorationOrderDrawLinePO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Repository("decorationOrderDrawLineDao")
public class DecorationOrderDrawLineDaoImpl extends DaoImpl<DecorationOrderDrawLinePO> implements DecorationOrderDrawLineDao {

	public DecorationOrderDrawLineDaoImpl(){
		super(DecorationOrderDrawLinePO.class);
	}
	
	@Override
	public List<DecorationOrderDrawLinePO> pageDecorationOrderDrawLine(Paging paging, List<FilterVO> filters){
		PagingQuery<DecorationOrderDrawLinePO> query = pagingQuery(paging, DecorationOrderDrawLinePO.class);
		
		queryFilterExcute(query, filters);
		
		query.asc("actualStartTime");
		
		return query.list();
	}
	
	@Override
	public List<DecorationOrderDrawLinePO> queryDecorationOrderDrawLine(List<FilterVO> filters) {
		
		PagingQuery<DecorationOrderDrawLinePO> query = pagingQuery(new Paging(), DecorationOrderDrawLinePO.class);
		
		queryFilterExcute(query, filters);
		
		query.notPaging();
		
		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<DecorationOrderDrawLinePO> queryDecorationOrderDrawLine(Timestamp startTime, Timestamp endTime){
		List<String> status = Arrays.asList(new String[]{"防线失败", "排队"});
		return (List<DecorationOrderDrawLinePO>)createCriteria(DecorationOrderDrawLinePO.class)
				.add(Restrictions.not(Restrictions.in("status", status)))
				.add(Restrictions.ge("actualStartTime", startTime))
				.add(Restrictions.le("actualStartTime", endTime))
				.list();
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<DecorationOrderDrawLinePO> queryDecorationOrderDrawLineByOrderId(String orderId){
		return createCriteria(DecorationOrderDrawLinePO.class)
				.add(Restrictions.eq("orderPO.orderId", orderId))
				.addOrder(Order.desc("autoId"))
				.list();
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<DecorationOrderDrawLinePO> queryDecorationOrderDrawLineByGroupATime(String group, Timestamp startTime,Timestamp endTime){
		List<String> status = Arrays.asList(new String[]{"防线失败", "排队"});
		return (List<DecorationOrderDrawLinePO>)createCriteria(DecorationOrderDrawLinePO.class)
				.add(Restrictions.not(Restrictions.in("status", status)))
				.add(Restrictions.or(
					Restrictions.or(
						Restrictions.or(
								Restrictions.and(Restrictions.gt("actualStartTime", startTime),Restrictions.lt("actualStartTime", endTime)),
								Restrictions.and(Restrictions.gt("actualEndTime", startTime),Restrictions.lt("actualEndTime", endTime))),
								Restrictions.and(Restrictions.lt("actualStartTime", startTime),Restrictions.gt("actualEndTime", startTime)
						)),
						Restrictions.and(Restrictions.gt("actualStartTime", endTime),Restrictions.lt("actualEndTime", endTime))))
				.add(Restrictions.eq("drawLineGroup", group))
				.list();
	}
	
	private void queryFilterExcute(PagingQuery<?> query, List<FilterVO> filters){
		if(filters != null){

			query.alias("orderPO", "orderPO");
			query.alias("orderPO.villagePO", "villagePO");
			query.alias("orderPO.designerPO", "designerPO");
			query.alias("orderPO.salesmanPO", "salesmanPO");
			
			query.alias("designerPO.dept", "designerDept");
			query.alias("salesmanPO.dept", "salesmanDept");
			
			for(FilterVO filter: filters){
				if(StringUtils.isNotEmpty(filter.getData())){
					if("orderId".equals(filter.getField())){
						query.add(query.getCriterion("orderPO.orderId",(filter.getData()), filter.getOp()));
					}else if("villageId".equals(filter.getField())){
						query.add(query.getCriterion("villagePO.villageId", (filter.getData()), filter.getOp()));
					}else if("village".equals(filter.getField())){
						query.add(query.getCriterion("villagePO.villageName", (filter.getData()), filter.getOp()));
					}else if("drawLineGroup".equals(filter.getField())){
						query.add(query.getCriterion("drawLineGroup", (filter.getData()), filter.getOp()));
					}else if("businessDepartment".equals(filter.getField())){				
						query.add(query.getCriterion("dept.deptName", (filter.getData()), filter.getOp()));
					}else if("designDepartment".equals(filter.getField())){
						query.add(query.getCriterion("dept.deptName", (filter.getData()), filter.getOp()));
					}else if("businessDepartmentId".equals(filter.getField())){				
						query.add(query.getCriterion("salesmanDept.deptId", (filter.getData()), filter.getOp()));
					}else if("designDepartmentId".equals(filter.getField())){
						query.add(query.getCriterion("designerDept.deptId", (filter.getData()), filter.getOp()));
					}else if("salesmanId".equals(filter.getField())){
						query.add(query.getCriterion("salesmanPO.userId", (filter.getData()), filter.getOp()));
					}else if("designerId".equals(filter.getField())){
						query.add(query.getCriterion("designerPO.userId", (filter.getData()), filter.getOp()));
					}else if("salesman".equals(filter.getField())){
						query.add(query.getCriterion("salesmanPO.currentName", (filter.getData()), filter.getOp()));
					}else if("designer".equals(filter.getField())){
						query.add(query.getCriterion("designerPO.currentName", (filter.getData()), filter.getOp()));
					}else if("status".equals(filter.getField())){
						query.add(query.getCriterion("status", (filter.getData()), filter.getOp()));
					}else if("actualDate".equals(filter.getField())){
						
						if("between".equals(filter.getOp())){
							String sTime = filter.getData() + " 00:00:00";
				            String eTime = filter.getData() + " 23:59:59";

				            Date sDate = DateUtil.parseDate(sTime, "yyyy-MM-dd HH:mm:ss");
				            Date eDate = DateUtil.parseDate(eTime, "yyyy-MM-dd HH:mm:ss");

				            Timestamp sTimestamp = DateUtil.getDateToTimestamp(sDate);
				            Timestamp eTimestamp = DateUtil.getDateToTimestamp(eDate);
							query.add(query.getCriterion("actualStartTime", sTimestamp, "ge"));
							query.add(query.getCriterion("actualStartTime", eTimestamp, "le"));
						}else{
							query.add(query.getCriterion("actualStartTime", filter.getData(), filter.getOp()));
						}
					}else {
						query.add(query.getCriterion(filter.getField(),(filter.getData()), filter.getOp()));
					}
				}
			}
		}
	}
}
