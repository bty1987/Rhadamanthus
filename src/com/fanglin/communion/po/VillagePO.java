package com.fanglin.communion.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fanglin.system.po.CityProperPO;

@Entity
@Table(name = "village", catalog = "communion")
public class VillagePO implements Serializable {

	private static final long serialVersionUID = -6088354807004872639L;
	
	public static final String COLUMN_STATUS_STR = "status";
	
	public static final short STATUS_ENABLE_INT = 0;
	
	public static final short STATUS_DISABLE_INT = 1;
	
	private long vid;

	private String no;

	private String name;

	private String pinyinAB ;

	private String pinyinAll ;

	private CityProperPO cityProper;

	private String developer;

	private String salesPhone;

	private String deliveryTime;
	
	private String rule;

	private String content;
	
	private double x;
	
	private double y;
	
	private short status;

	public VillagePO(){
		super();
	}

	public VillagePO(String no) {
		super();
		this.no = no;
	}

	public VillagePO(CityProperPO cityProper) {
		super();
		this.cityProper = cityProper;
	}
	
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "vid") 
	public long getVid() {
		return vid;
	}

	public void setVid(long vid) {
		this.vid = vid;
	}

	@Id
	@Column(name = "no")
	public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "pinyinAll")
	public String getPinyinAll() {
		return pinyinAll;
	}

	public void setPinyinAll(String pinyinAll) {
		this.pinyinAll = pinyinAll;
	}

	@Column(name = "pinyinAB")
	public String getPinyinAB() {
		return pinyinAB;
	}

	public void setPinyinAB(String pinyinAB) {
		this.pinyinAB = pinyinAB;
	}

	@javax.persistence.ManyToOne(fetch = FetchType.EAGER)
	@javax.persistence.JoinColumn(nullable = false, name = "cityProperId", referencedColumnName = "cpid")
	public CityProperPO getCityProper(){
		return cityProper;
	}

	public void setCityProper(CityProperPO cityProper){
		this.cityProper = cityProper;
	}

	@Column(name = "developer")
	public String getDeveloper(){
		return developer;
	}

	public void setDeveloper(String developer){
		this.developer = developer;
	}

	@Column(name = "salesPhone")
	public String getSalesPhone(){
		return salesPhone;
	}

	public void setSalesPhone(String salesPhone){
		this.salesPhone = salesPhone;
	}

	@Column(name = "deliveryTime")
	public String getDeliveryTime(){
		return deliveryTime;
	}

	public void setDeliveryTime(String deliveryTime){
		this.deliveryTime = deliveryTime;
	}
	
	@Column(name = "rule")
	public String getRule() {
		return rule;
	}

	public void setRule(String rule) {
		this.rule = rule;
	}

	@Column(name = "content")
	public String getContent(){
		return content;
	}

	public void setContent(String content){
		this.content = content;
	}

	@Column(name = "x")
	public double getX(){
		return x;
	}

	public void setX(double x){
		this.x = x;
	}

	@Column(name = "y")
	public double getY(){
		return y;
	}

	public void setY(double y){
		this.y = y;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

}
