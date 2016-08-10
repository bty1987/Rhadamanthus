package com.fanglin.core.dao.impl;

import java.io.Serializable;
import java.util.Collections;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.hibernate.Criteria;
import org.hibernate.Query;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;
import org.hibernate.type.StringType;

import com.fanglin.core.dao.GenericDao;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.utils.Paging;

public abstract class GenericDaoImpl implements GenericDao {

	protected SessionFactory sessionFactory;
	
	protected SessionFactory communionSessionFactory;
	
	protected SessionFactory financeSessionFactory;

	public SessionFactory getSessionFactory(){
		return sessionFactory;
	}

	public void setSessionFactory(SessionFactory sessionFactory){
		this.sessionFactory = sessionFactory;
	}

	protected Session session(){
		return this.sessionFactory.getCurrentSession();
	}
	
	public SessionFactory getCommunionSessionFactory() {
		return communionSessionFactory;
	}

	public void setCommunionSessionFactory(SessionFactory communionSessionFactory) {
		this.communionSessionFactory = communionSessionFactory;
	}
	
	protected Session communionSession(){
		return this.communionSessionFactory.getCurrentSession();
	}

	public SessionFactory getFinanceSessionFactory() {
		return financeSessionFactory;
	}

	public void setFinanceSessionFactory(SessionFactory financeSessionFactory) {
		this.financeSessionFactory = financeSessionFactory;
	}
	
	protected Session financeSession(){
		return this.financeSessionFactory.getCurrentSession();
	}

	@Override
	public void delete(Object obj){
		session().delete(obj);
	}

	@Override
	public void save(Object obj){
		session().save(obj);
	}
	
	@Override
	public void merge(Object obj) {
		session().merge(obj);
	}

	@Override
	public void update(Object obj){
		session().update(obj);
	}

	@Override
	public void refresh(Object obj){
		session().refresh(obj);
	}

	protected Query createQuery(String hql){
		Query query = session().createQuery(hql);
		return query;
	}

	protected SQLQuery createSQLQuery(String sql){
		return session().createSQLQuery(sql);
	}

	@SuppressWarnings("unchecked")
	protected <E> E get(Class<E> clazz, Serializable id){
		return (E) session().get(clazz, id);
	}

	protected void deleteById(Class<?> clazz, Serializable id){
		Session session = session();
		Object obj = session().get(clazz, id);
		if(obj != null){
			session.delete(obj);
		}
	}
	
	protected Criteria createCriteria(Class<?> clazz){
		return session().createCriteria(clazz);
	}

	@Override
	public void saveOrUpdate(Object obj){
		session().saveOrUpdate(obj);
	}
	
	@Override
	public void flush(){
		session().flush();
	}
	
	@Override
	public void clear(){
		session().clear();
	}

	protected <E> TopQuery<E> topQuery(int maxResults, Class<E> clazz){
		return new TopQuery<E>(maxResults, clazz, null);
	}

	protected <E> TopQuery<E> topQuery(int maxResults, Class<E> clazz, String cacheRegion){
		return new TopQuery<E>(maxResults, clazz, cacheRegion);
	}

	protected <E> PagingQuery<E> pagingQuery(Paging paging, Class<E> clazz){
		return new PagingQuery<E>(paging, clazz, null);
	}

	protected <E> PagingQuery<E> pagingQuery(Paging paging, Class<E> clazz, String cacheRegion){
		return new PagingQuery<E>(paging, clazz, cacheRegion);
	}

	protected class TopQuery<T> implements Serializable {
		private static final long serialVersionUID = 8331182441328915375L;

		String cacheRegion;

		Class<T> clazz;

		List<Criterion> criterions = null;

		List<Order> orders = null;

		Map<String, Alias> aliases = null;

		int maxResults;

		public TopQuery(int maxResults, Class<T> clazz, String cacheRegion){
			this.maxResults = maxResults;
			this.clazz = clazz;
			this.cacheRegion = cacheRegion;
		}

		public TopQuery<T> add(Criterion c){
			if(criterions == null){
				criterions = new LinkedList<Criterion>();
			}
			criterions.add(c);
			return this;
		}
		
		@SuppressWarnings("unchecked")
		public Criterion getCriterion(String propertyName, Object value, String op){
			
			if("eq".equals(op)){
				return Restrictions.eq(propertyName,value);
			}else if("cn".equals(op)){
				return Restrictions.ilike(propertyName, (String) value, MatchMode.ANYWHERE);
			}else if("nc".equals(op)){
				return Restrictions.not(Restrictions.ilike(propertyName, (String) value, MatchMode.ANYWHERE));
			}else if("lt".equals(op)){
				return Restrictions.lt(propertyName, value);
			}else if("le".equals(op)){
				return Restrictions.le(propertyName, value);
			}else if("gt".equals(op)){
				return Restrictions.gt(propertyName, value);
			}else if("ge".equals(op)){
				return Restrictions.ge(propertyName, value);
			}else if("bw".equals(op)){
				return Restrictions.ilike(propertyName, (String) value, MatchMode.START);
			}else if("ew".equals(op)){
				return Restrictions.ilike(propertyName, (String) value, MatchMode.END);
			}else if("bn".equals(op)){
				return Restrictions.not(Restrictions.ilike(propertyName, (String) value, MatchMode.START));
			}else if("en".equals(op)){
				return Restrictions.not(Restrictions.ilike(propertyName, (String) value, MatchMode.END));
			}else if("ne".equals(op)){
				return Restrictions.ne(propertyName,value);
			}else if("in".equals(op)){
				return Restrictions.in(propertyName, (List<T>)value);
			}else if("ni".equals(op)){
				return Restrictions.not(Restrictions.in(propertyName, (List<T>)value));
			}else if("likecn".equals(op)){
				return Restrictions.like(propertyName, value);
			}else if("and".equals(op)){
				return Restrictions.sqlRestriction(propertyName + " & ?", (String) value, StringType.INSTANCE);
			}else{
				return Restrictions.eq(propertyName, value);
			}
		}

		public TopQuery<T> asc(String field){
			return add(Order.asc(field));
		}

		public TopQuery<T> desc(String field){
			return add(Order.desc(field));
		}

		public TopQuery<T> alias(String field, String alias){
			if(aliases == null){
				aliases = new HashMap<String, Alias>();
			}
			
			if(aliases.get(field) == null){
				aliases.put(field, new Alias(field, alias));
			}
			
			return this;
		}

		@SuppressWarnings("unchecked")
		public List<T> list(){
			Criteria criteria = criteria(true);
			if(maxResults > 0){
				criteria.setMaxResults(maxResults);
			}
			return criteria.list();
		}
		
		protected Criteria criteria(boolean sortable){
			Criteria criteria = createCriteria(clazz);
			
			if(criterions != null){
				if(aliases != null){
					Set<String> aliasKeys = aliases.keySet();
					
					for(String key: aliasKeys){
						Alias alias = aliases.get(key);
						criteria.createAlias(alias.field, alias.alias);
					}
				}
				
				for(Criterion criterion: criterions){
					criteria.add(criterion);
				}
			}
			
			if(cacheRegion != null){
				criteria.setCacheRegion(cacheRegion);
			}

			if(sortable && orders != null){
				for(Order order: orders){
					criteria.addOrder(order);
				}
			}

			return criteria;
		}

		private TopQuery<T> add(Order order){
			if(orders == null){
				orders = new LinkedList<Order>();
			}
			orders.add(order);
			return this;
		}
	}

	protected class PagingQuery<T> extends TopQuery<T> implements Serializable {
		private static final long serialVersionUID = 397003060855915658L;

		boolean pagingFlag = true;
		Paging paging;

		public PagingQuery(Paging paging, Class<T> clazz, String cacheRegion){
			super(paging.getRows(), clazz, cacheRegion);
			this.paging = paging;
		}
		
		@Override
		public Criterion getCriterion(String propertyName, Object value, String op){
			return super.getCriterion(propertyName, value, op);
		}
		
		public Criterion getCriterion(String propertyName, FilterVO filter){
			return getCriterion(propertyName, filter.getData(), filter.getOp());
		}
		
		public Criterion getCriterion(FilterVO filter){
			return getCriterion(filter);
		}

		@Override
		@SuppressWarnings("unchecked")
		public List<T> list(){
			
			List<T> results = Collections.EMPTY_LIST;
			
			if(pagingFlag && paging.getNoPage() == 0){
				
				boolean query = true;
				
				// 统计数据总数
				int totalCount = ((Number) criteria(false).setProjection(Projections.rowCount()).uniqueResult()).intValue();
				paging.setTotalRecords(totalCount);
				
				if(totalCount <= (paging.getPage() - 1) * paging.getRows()){
					query = false;
				}
	
				if(!query){
					paging.setPage(1);
				}
				
				results = criteria(true).setFirstResult((paging.getPage() - 1) * paging.getRows()).setMaxResults(paging.getRows()).list();

				int offset = totalCount % (paging.getRows()) == 0 ? 0 : 1;
				paging.setTotalPage(totalCount / (paging.getRows()) + offset);
			}else{
				Criteria c = criteria(true);
				results = c.list();
			}
			
			paging.setData(results);

			return results;
		}
		
		@SuppressWarnings("unchecked")
		public List<T> allList(){
			int totalCount = ((Number) criteria(false).setProjection(Projections.rowCount()).uniqueResult()).intValue();
			return criteria(true).setFirstResult(0).setMaxResults(totalCount).list();
		}
		
		public void notPaging(){
			this.pagingFlag = false;
		}
		
		public double sumForField(String field){
			double sum = (Double) criteria(false).setProjection(Projections.sum(field)).uniqueResult();
			return sum;
		}
	}

	private class Alias implements Serializable {

		private static final long serialVersionUID = 5152383719243132307L;

		private String field;

		private String alias;

		public Alias(String field, String alias){
			this.field = field;
			this.alias = alias;
		}
	}
}
