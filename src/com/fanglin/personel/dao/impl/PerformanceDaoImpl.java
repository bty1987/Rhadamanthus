package com.fanglin.personel.dao.impl;
import java.sql.Timestamp;
import java.util.Date;
import java.util.List;
import org.springframework.stereotype.Repository;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.personel.dao.PerformanceDao;
import com.fanglin.personel.po.PerformancePO;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;
@Repository("performanceDao")
public class PerformanceDaoImpl extends DaoImpl<PerformancePO> implements PerformanceDao{

	@Override
	public List<PerformancePO> pagePerformance(Paging paging,List<Filter> filters) {
		
		PagingQuery<PerformancePO> query = pagingQuery(paging, PerformancePO.class);
				
				if(filters != null){
					
					for (Filter filter : filters) {
						String field = filter.getField();
						String data = filter.getData();
						String op = filter.getOp();
						
						if(field.equals("type")){
							query.add(query.getCriterion(field, Short.valueOf(data), op));
						}else if("performancestartTime".equals(field)){
							
							String sTime = data.split("-")[0].replaceAll("/", "-") + " 00:00:00";
							String eTime = data.split("-")[1].replaceAll("/", "-") + " 23:59:59";

							Date sDate = DateUtil.parseDate(sTime, "yyyy-MM-dd HH:mm:ss");
							Date eDate = DateUtil.parseDate(eTime, "yyyy-MM-dd HH:mm:ss");

							Timestamp sTimestamp = DateUtil.getDateToTimestamp(sDate);
							Timestamp eTimestamp = DateUtil.getDateToTimestamp(eDate);

							query.add(query.getCriterion("startTime", eTimestamp, "le"));
							query.add(query.getCriterion("startTime", sTimestamp, "ge"));
						}
						else if("performanceendTime".equals(field)){
							String sTime = data.split("-")[0].replaceAll("/", "-") + " 00:00:00";
							String eTime = data.split("-")[1].replaceAll("/", "-") + " 23:59:59";

							Date sDate = DateUtil.parseDate(sTime, "yyyy-MM-dd HH:mm:ss");
							Date eDate = DateUtil.parseDate(eTime, "yyyy-MM-dd HH:mm:ss");

							Timestamp sTimestamp = DateUtil.getDateToTimestamp(sDate);
							Timestamp eTimestamp = DateUtil.getDateToTimestamp(eDate);

							query.add(query.getCriterion("endTime", eTimestamp, "le"));
							query.add(query.getCriterion("endTime", sTimestamp, "ge"));
						}else if("userName".equals(field)){
							query.alias("user", "user");
							query.add(query.getCriterion("user.userId", data, op));
						}
					}
				}
				
				return query.list();
		
	}
}
