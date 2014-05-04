shape <- readOGR("D:/My Documents/Google Drive/Data Viz Project/Data_PopulationIncome/tl_2012_04_tract", "tl_2012_04_tract" )
data <- read.csv("D:/My Documents/Google Drive/Data Viz Project/Data_PopulationIncome/ACS_12_5YR_B01003_state/ACS_12_5YR_B01003_with_ann.csv", header = T)
#data <- data[order(data$GEO.id2),]

colnames(data)[4] <- "Population"
IDS=as.numeric(as.character(shape$GEOID))
pop = IDS

for (i in 1:length(IDS)) {
	t = data[data$GEO.id2 == as.numeric(IDS[i]), ]
	pop[i] = as.numeric(as.character(t$Population))
}


shape@data$Population = pop

income.data <- read.csv("D:/My Documents/Google Drive/Data Viz Project/Data_PopulationIncome/Income_state/ACS_12_5YR_S1903_with_ann.csv",header = T)
colnames(income.data)[6] <- "Income"
income = IDS
for (i in 1:length(IDS)){
	t = income.data[income.data$GEO.id2 == as.numeric(IDS[i]), ]

	if(as.character(t$Income) == "-" | as.character(t$Income) == ""){
		income[i] = 0
	}
	else{
		income[i] = as.numeric(as.character(t$Income))
	}
}
shape@data$Income = income
shape@data = shape@data[, c(1:10, 13, 14, 11, 12)]

#crime.data <- read.csv("D:/My Documents/Google Drive/Data Viz Project/Data_Crime/GEOID-MONTH-CRIME.csv", header = T)

all.data <- read.csv("D:/My Documents/Google Drive/Data Viz Project/FinalTables/GEOIDTable.csv", header = T)
phx.shape = shape
phx.shape = phx.shape[as.double(as.character(phx.shape$INTPTLAT)) < 33.9, ]
phx.shape = phx.shape[as.double(as.character(phx.shape$INTPTLAT)) > 33.3, ]
phx.shape = phx.shape[as.double(as.character(phx.shape$INTPTLON)) < -111.9, ]
phx.shape = phx.shape[as.double(as.character(phx.shape$INTPTLON)) > -112.3, ]

IDS=as.numeric(as.character(phx.shape$GEOID))
a.data <- matrix(ncol = ncol(all.data)-5, nrow = length(IDS))
a.data <- as.data.frame(a.data)
for(i in 1:ncol(a.data)){
  colnames(a.data)[i] <- as.character(dimnames(all.data)[[2]][i+5])
}

for(i in 1:length(IDS)){
	t = all.data[all.data$GEOID == as.numeric(IDS[i]), ]
	a.data[i, c(1:ncol(a.data))] <- t[, c(6:ncol(all.data))]
}

phx.shape@data[,c(15: (15 + ncol(a.data)-1))] <- a.data
writeOGR(phx.shape, dsn = 'D:/My Documents/Google Drive/Data Viz Project/Data_PopulationIncome', layer ='newshape', driver = 'ESRI Shapefile')


#////////////////////////////////////////////////////////////////////////////#
#IDS=as.numeric(as.character(phx.shape$GEOID))
#crime <- matrix(ncol= 24, nrow = length(IDS))
#crime <- as.data.frame(crime)
#for(i in 1:24){
#	colnames(crime)[i] <- paste("Crime", i, sep = "")
#}
#
#for(i in 1:length(IDS)){
#	t = crime.data[crime.data$GEOID == as.numeric(IDS[i]), ]
#	crime[i, c(1:24)] <- t[, c(3:26)]
#}
#phx.shape@data[,c(15: (15 + 23) )] <- crime
#writeOGR(phx.shape, dsn = 'D:/My Documents/Google Drive/Data Viz Project/Data_PopulationIncome', layer ='newshape', driver = 'ESRI Shapefile')

